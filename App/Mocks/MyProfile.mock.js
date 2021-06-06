const mockGenders = [
	{ value: '', label: 'Unknown' },
	{
		value: '8cbe98d3-7c5d-44ea-a973-d6e12962889e',
		label: 'Attack Helicopter',
	},
	{
		value: '938d34ad-dadb-4814-821e-3cac89f2ce62',
		label: 'Female',
	},
	{
		value: '34fcc69c-cfd1-4ae1-8e41-8c22e6d828cc',
		label: 'Male',
	},
	{
		value: '3df7618c-af45-4e83-a1fd-420b49173b37',
		label: 'Bear',
	},
];

const mockProfile = {
	nickname: 'TheBritishAreComing',
	name: 'James',
	tagline: 'I am British',
	picture: 'https://i.imgur.com/yRglJ9u.png',
	cover_picture: 'https://i.imgur.com/QOiVEk8.png',
	about: "I'm not the pheasant plucker, I'm the pheasant plucker's mate, and I'm only plucking pheasants 'cause the pheasant plucker's late. I'm not the pheasant plucker, I'm the pheasant plucker's son, and I'm only plucking pheasants till the pheasant pluckers come.",
	date_of_birth: '1986-02-28',
	age: '35',
	from_location: 'Bristol, UK',
	current_location: 'Bristol, UK',
	gender_id: mockGenders[1].value,
	gender: {
		id: mockGenders[1].value,
		name: mockGenders[1].label,
	},
};

export { mockGenders, mockProfile };
