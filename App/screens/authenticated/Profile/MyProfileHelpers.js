import Helpers from '../../../sosa/Helpers';

const refreshProfile = (profileService, setGenders, setProfile) => {
	setGenders([]);

	profileService
		.mine(true)
		.then(({ profile, options, widgets }) => {
			if (options) {
				const { genders } = options;
				if (Array.isArray(genders) && genders.length) {
					const newOptions = genders.map(({ id, name }) => ({
						label: name,
						value: id,
					}));
					setGenders(newOptions);
				}
			}
			console.debug(profile);
			setProfile(profile);
		})
		.catch((error) => console.debug(error));
};

const updateProfileState = (fields, setProfile, profile) => {
	const copiedEntity = Object.assign(
		Object.create(Object.getPrototypeOf(profile)),
		profile,
		fields,
	);
	setProfile(copiedEntity);
};

const saveProfile = async (data, dirty, profileService, setProfile) => {
	console.debug(data, dirty);
	if (Object.keys(dirty).length) {
		try {
			const updatedProfile = await profileService.save(dirty);
			setProfile(updatedProfile);
		} catch (e) {}
	}
};

const uploadImage = async (
	field,
	setIsLoading,
	generalService,
	profileService,
	setProfile,
	modals,
) => {
	try {
		const options = {
			handleUpload: (file) => {
				setIsLoading(true);
				return generalService.handleUpload('sosa', file);
			},
			cropperToolbarTitle: 'Crop your picture',
			cropping: true,
			croppingHeight: field === 'picture' ? 600 : 1080,
			croppingWidth: field === 'picture' ? 600 : 1920,
		};

		const { uris, tag, uuid } = await Helpers.uploadFile(options);

		if (Array.isArray(uris)) {
			const toSave = { [field]: uris.pop() };
			await saveProfile(toSave, toSave, profileService, setProfile);
		}
	} catch (e) {
		const message = Array.isArray(e) ? e.pop()?.message : e?.message;
		if (message !== 'user_cancelled') {
			modals?.create('Error uploading image', message);
		}
	} finally {
		setIsLoading(false);
	}
};

const updateFromEntity = (entity, formValues, setFormValues, reset) => {
	const keys = Object.keys(formValues);
	const newFormValues = {};

	keys.forEach((key) => {
		newFormValues[key] = Object.hasOwnProperty.call(entity, key)
			? entity[key]
			: formValues[key];
	});

	const { gender } = entity;

	if (gender?.id) newFormValues.gender_id = gender?.id;

	setFormValues(newFormValues);
	reset(newFormValues);
};

const handleSave = (form, onSave, formValues, setFormValues) => {
	const { handleSubmit, reset, formState } = form;
	const { dirtyFields } = formState;

	return new Promise((resolve, reject) => {
		const isValid = async (data) => {
			const dirty = {};

			for (const key in dirtyFields) {
				if (dirtyFields[key] && Object.hasOwnProperty.call(data, key)) {
					dirty[key] = data[key];
				}
			}

			try {
				await onSave(data, dirty);

				updateFromEntity(dirty, formValues, setFormValues, reset);
				resolve(data);
			} catch (e) {
				console.debug(e);
				reject();
			}
		};

		const isErrored = (data) => {
			reject();
		};

		handleSubmit(isValid, isErrored)();
	});
};

export {
	refreshProfile,
	saveProfile,
	updateProfileState,
	uploadImage,
	updateFromEntity,
	handleSave,
};
