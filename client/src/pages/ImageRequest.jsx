import { useMutation } from '@apollo/client';
import { TextField, ThemeProvider } from '@mui/material';
import { Form, Formik, useField } from 'formik';
import { useState } from 'react';
import Dropzone from 'react-dropzone';
import { FaTrash } from 'react-icons/fa';
import * as yup from 'yup';
import ActionButton from '../components/ActionButton';
import { ADD_REQUESTED_IMAGE } from '../mutations/imageMutations';
import { GET_REQUESTED_IMAGES } from '../queries/imageQueries';
import '../scss/Buttons.scss';
import '../scss/ImageRequest.scss';
import { theme } from '../style/themes';

const MyTextField = ({
	placeholder,
	label,
	type,
	multiline,
	rows,
	className,
	autoComplete,
	disabled,
	...props
}) => {
	const [field, meta] = useField(props);
	const errorText = meta.error && meta.touched ? meta.error : '';

	return (
		<TextField
			{...field}
			error={!!errorText}
			helperText={errorText}
			placeholder={placeholder}
			label={label}
			type={type}
			multiline={multiline}
			rows={rows}
			className={className}
			autoComplete={autoComplete}
			disabled={disabled}
		/>
	);
};

const schema = yup.object({
	title: yup.string().max(15),
	description: yup.string().max(15),
	journalist: yup.string().max(15),
	email: yup.string().max(50).required('email is required'),
});

const ImageRequest = () => {
	const [image, setImage] = useState(null);
	const [thumbnail, setThumbnail] = useState(null);

	const [addRequestedImage, { data: reqImgData }] =
		useMutation(ADD_REQUESTED_IMAGE);

	const imageToThumbnail = image => {
		const reader = new FileReader();
		reader.readAsDataURL(image);
		reader.onload = () => {
			setThumbnail(reader.result);
		};
	};

	return (
		<>
			<div className='image-request-container container d-flex flex-column'>
				<h1>Image Request Submission</h1>
				<ThemeProvider theme={theme}>
					<section className='profile-section d-flex'>
						<Formik
							validationSchema={schema}
							initialValues={{
								title: '',
								email: '',
								description: '',
								journalist: '',
							}}
							onSubmit={async (data, { setSubmitting, resetForm }) => {
								setSubmitting(true);
								const { title, email, journalist, description } = data;
								try {
									await addRequestedImage({
										variables: {
											title,
											email,
											description,
											journalist,
											image_file: image,
										},
										refetchQueries: [{ query: GET_REQUESTED_IMAGES }],
									});

									resetForm();
									setImage(null);
									setThumbnail(null);
								} catch (error) {
									console.log(error);
								}
								setSubmitting(false);
							}}
						>
							{({ values, isSubmitting }) => (
								<Form className='d-flex flex-column w-100 mt-3 align-items-left'>
									<div className='textfield'>
										<MyTextField
											name='title'
											label='title'
											placeholder='title'
											type='input'
											as={TextField}
											autoComplete='off'
										/>
									</div>
									<div className='textfield'>
										<MyTextField
											name='journalist'
											label='journalist'
											placeholder='journalist'
											type='input'
											as={TextField}
											autoComplete='off'
										/>
									</div>
									<div className='textfield'>
										<MyTextField
											name='email'
											label='email'
											placeholder='email'
											type='input'
											autoComplete='off'
											as={TextField}
										/>
									</div>
									<div className='textfield'>
										<MyTextField
											name='description'
											label='description'
											placeholder='description'
											type='input'
											multiline
											rows={4}
											autoComplete='off'
										/>
									</div>
									{!image ? (
										<Dropzone
											accept={{ 'image/*': ['.jpeg', '.png'] }}
											maxFiles={1}
											maxSize={10000000}
											onDrop={([file]) => {
												setImage(file);
												imageToThumbnail(file);
											}}
										>
											{({ getRootProps, getInputProps }) => (
												<section>
													<div {...getRootProps()}>
														<input {...getInputProps()} />
														<p className='dropzone-field'>
															Drag 'n' drop an image file here, or click to
															select the image file
														</p>
													</div>
												</section>
											)}
										</Dropzone>
									) : (
										<>
											<div className='imageUpload'>
												{image?.name}
												<ActionButton
													color='outlined'
													className='delete-image-button'
													variant='secondary'
													onClick={() => {
														setImage(null);
														setThumbnail(null);
													}}
												>
													<FaTrash />
												</ActionButton>
												<div className='image-preview p-2'>
													<span>Image preview</span>
													<img
														src={thumbnail}
														className='img-thumbnail'
														alt='thumbnail'
													/>
												</div>
											</div>
										</>
									)}
									<div className='button-field mt-3'>
										<ActionButton
											color='primary'
											variant='outlined'
											disabled={isSubmitting}
											type='submit'
											className='form-button'
										>
											Send request
										</ActionButton>
									</div>
								</Form>
							)}
						</Formik>
					</section>
				</ThemeProvider>
			</div>
		</>
	);
};
export default ImageRequest;
