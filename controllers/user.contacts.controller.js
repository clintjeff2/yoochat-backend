const UserContacts = require('./../models/user.contacts.model');
const ErrorApi = require('./../utilities/ErrorApi');
const catchAsync = require('./../utilities/catchAsync');
const sendResponse = require('./../utilities/sendResponse');

//Finding specific contact card based on current logged in user
const contactCard = async (req) => {
	const card = await UserContacts.findOne({ user: req.user._id });
	if (card) return card;
	return false;
};

exports.createAddContact = catchAsync(async (req, res, next) => {
	//Check if user has a contact card
	const card = await contactCard(req);
	let contact;

	//Get contact information
	const { _id: id } = req.user;
	const { user: contactID } = req.body;

	//check if contact information exist
	if (!contactID)
		return next(new ErrorApi('Contact information not provided', 400));

	if (card) {
		//add contact to existing contact card
		const { contacts } = card;

		//Check if contact is already on contact list, else add to contact list
		const isContactOnCard = contacts.find((el) => el.user == contactID);
		if (isContactOnCard)
			return next(
				new ErrorApi('This contact is already on your contact list', 400)
			);
		contacts.push({ user: contactID });
		console.log(contacts, 'CROSSED');

		//update card
		contact = await UserContacts.findOneAndUpdate(
			{ user: id },
			{ contacts },
			{
				new: true,
				// runValidators: true,
			}
		);

		//if card is not updated or not found throw error
		if (!contact)
			return next(
				new ErrorApi(`Contact card for ${req.user.username} not found`, 400)
			);
		// console.log('UPDATE', contact);
	} else {
		//create first contact
		contact = await UserContacts.create({
			user: id,
			contacts: { user: contactID },
		});
		// console.log('CREATE', contact);
	}

	//send response
	sendResponse(res, 'success', 201, contact);
});

exports.getContacts = catchAsync(async (req, res, next) => {
	//Get all associated contacts to this account, only a card though!
	const card = await UserContacts.find({ user: req.user._id });
	let { contacts } = card[0];

	//return error if no contacts found
	if (!card)
		return next(
			new ErrorApi('Contact list is empty, search to find your contacts', 404)
		);

	//set default contact name to each user's username if you've not set a name for them
	contacts = contacts.map((contact) => {
		if (!contact.contactName) {
			contact.contactName = contact.user.username;
		}
		return contact;
	});

	//Send response
	sendResponse(res, 'success', 200, contacts);
});

exports.updateContactName = catchAsync(async (req, res, next) => {
	//get contact card, contactID, and contactName.
	const card = await contactCard(req);
	const { contactID } = req.params;
	const { contactName } = req.body;
	let { contacts } = card;

	//modify contactName if exist
	if (!contactName || !contactID)
		return next(
			new ErrorApi('Please provide complete information for this contact', 400)
		);

	contacts = contacts.map((contact) => {
		if (`${contact.user}` === contactID) contact.contactName = contactName;

		return contact;
	});

	//Update contact in DB HERE
	contacts = await UserContacts.findOneAndUpdate(
		{ user: req.user._id },
		{ contacts },
		{
			runValidators: true,
			returnOriginal: false,
		}
	);

	//if card is not updated or not found throw error
	if (!contacts)
		return next(
			new ErrorApi(`Contact card for ${req.user.username} not  updated`, 400)
		);

	sendResponse(res, 'success', 200, contacts);
});

exports.deleteUserContact = catchAsync(async (req, res, next) => {
	//get contactID and remove from list of users contact card;
	const { contactID } = req.params;
	const card = await contactCard(req);
	let { contacts } = card;

	//throw error if contact you wish to delete is not found
	if (!contactID)
		return next(new ErrorApi('Provide the contact you wish to delete', 400));

	contacts = contacts.filter((contact) => `${contact.user}` !== contactID);

	//Update contacts in DB
	contacts = await UserContacts.findOneAndUpdate(
		{ user: req.user._id },
		{ contacts },
		{
			new: true,
			runValidators: true,
		}
	);
	//if card is not updated or not found throw error
	if (!contacts)
		return next(
			new ErrorApi(`Contact card for ${req.user.username} not found`, 400)
		);

	sendResponse(res, 'success', 200, contacts);
});

exports.getAllContacts = catchAsync(async (req, res, next) => {
	const contacts = await UserContacts.find({});

	sendResponse(res, 'success', 200, contacts);
});
