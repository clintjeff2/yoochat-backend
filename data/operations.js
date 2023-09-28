const fs = require('fs');

const photos = [
	'https://randomuser.me/api/portraits/men/75.jpg',

	'https://randomuser.me/api/portraits/women/75.jpg',

	'https://randomuser.me/api/portraits/men/76.jpg',

	'https://randomuser.me/api/portraits/women/76.jpg',

	'https://randomuser.me/api/portraits/men/77.jpg',

	'https://randomuser.me/api/portraits/women/77.jpg',

	'https://randomuser.me/api/portraits/men/78.jpg',

	'https://randomuser.me/api/portraits/women/78.jpg',

	'https://randomuser.me/api/portraits/men/79.jpg',

	'https://randomuser.me/api/portraits/women/79.jpg',

	'https://randomuser.me/api/portraits/men/80.jpg',

	'https://randomuser.me/api/portraits/women/80.jpg',

	'https://randomuser.me/api/portraits/men/81.jpg',

	'https://randomuser.me/api/portraits/women/81.jpg',

	'https://randomuser.me/api/portraits/men/82.jpg',

	'https://randomuser.me/api/portraits/women/82.jpg',

	'https://randomuser.me/api/portraits/men/83.jpg',

	'https://randomuser.me/api/portraits/women/83.jpg',

	'https://randomuser.me/api/portraits/men/84.jpg',

	'https://randomuser.me/api/portraits/women/84.jpg',

	'https://randomuser.me/api/portraits/men/85.jpg',

	'https://randomuser.me/api/portraits/women/85.jpg',

	'https://randomuser.me/api/portraits/men/86.jpg',

	'https://randomuser.me/api/portraits/women/86.jpg',

	'https://randomuser.me/api/portraits/men/87.jpg',

	'https://randomuser.me/api/portraits/women/87.jpg',

	'https://randomuser.me/api/portraits/men/88.jpg',

	'https://randomuser.me/api/portraits/women/88.jpg',

	'https://randomuser.me/api/portraits/men/89.jpg',

	'https://randomuser.me/api/portraits/women/89.jpg',

	'https://randomuser.me/api/portraits/men/90.jpg',

	'https://randomuser.me/api/portraits/women/90.jpg',
];

const userIds = [
	'6151acf5c8bc1c001fd8c6e1',
	'6151acf5c8bc1c001fd8c6e2',
	'6151acf5c8bc1c001fd8c6e3',
	'6151acf5c8bc1c001fd8c6e4',
	'6151acf5c8bc1c001fd8c6e5',
	'6151acf5c8bc1c001fd8c6e6',
	'6151acf5c8bc1c001fd8c6e7',
	'6151acf5c8bc1c001fd8c6e8',
	'6151acf5c8bc1c001fd8c6e9',
];
// const users = JSON.parse(fs.readFileSync('./user.data.json', 'utf-8'));

// Array.from({ length: 24 }).map((_, index) => {
// 	if (users) users[index].photo = photos[index];
//  console.log(users[index].photo);
// });

// fs.writeFile('./user.json', JSON.stringify(users), (err) => {
// 	if (!err) console.log('Written to file');
// });
