import { Field, Form, Formik, useField } from 'formik';
import React, { useMemo, useRef, useState } from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import { FaPlus, FaTimes, FaTrash } from 'react-icons/fa';
import ActionButton from './ActionButton';
import * as yup from 'yup';
import {
	Checkbox,
	TextareaAutosize,
	TextField,
	ThemeProvider,
} from '@mui/material';
import { theme } from '../style/themes';
import {
	ADD_IMAGE,
	ADD_TECHNICAL_METADATA,
	CREATE_IMAGE_TAG,
} from '../mutations/imageMutations';
import { gql, useMutation } from '@apollo/client';
import {
	GET_IMAGES_BY_TAG_NAME,
	GET_IMAGE_TAGS,
	GET_LATEST_VERSION_IMAGES,
} from '../queries/imageQueries';
import Dropzone from 'react-dropzone';
import exifr from 'exifr';
import '../scss/AddImageModal.scss';
import { DateTime } from 'luxon';
import { Badge } from 'react-bootstrap';
import { isEmpty } from 'lodash';

const MyTextField = ({
	placeholder,
	label,
	type,
	multiline,
	rows,
	className,
	autoComplete,
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
		/>
	);
};

const MyTagTextField = ({
	placeholder,
	label,
	type,
	multiline,
	rows,
	onChange,
	value,
	onKeyDown,
	className,
	autoComplete,
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
			onChange={onChange}
			value={value}
			onKeyDown={onKeyDown}
			className={className}
			autoComplete={autoComplete}
		/>
	);
};

const AddImageModal = () => {
	const uploadFileMutation = gql`
		mutation ($file: Upload!) {
			uploadFile(file: $file)
		}
	`;

	const [uploadFile] = useMutation(uploadFileMutation);

	const [addImage, { data: imgData }] = useMutation(ADD_IMAGE);
	const [addTechnicalMetadata, { data: tmData }] = useMutation(
		ADD_TECHNICAL_METADATA
	);

	const [createImageTag, { data: itData }] = useMutation(CREATE_IMAGE_TAG);
	const [show, setShow] = useState(false);
	const [distributable, setDistributable] = useState(false);
	const [tags, setTags] = useState(new Set());
	const [tagInputValue, setTagInputValue] = useState('');

	const handleAddTag = tag => {
		if (!isEmpty(tag)) {
			const newSet = new Set(tags);
			newSet.add(tag);
			setTags(newSet);
			setTagInputValue('');
		}
	};

	const handleRemoveTag = (index, tags, setTags) => {
		const tagsArray = Array.from(tags);
		tagsArray.splice(index, 1);
		setTags(new Set(tagsArray));
	};

	const handleClose = () => {
		setShow(false);
		setImage(null);
		setThumbnail(null);
		setDistributable(false);
		setTagInputValue('');
		setTags(new Set());
	};
	const handleShow = () => setShow(true);

	const [image, setImage] = useState(null);
	const [thumbnail, setThumbnail] = useState(null);

	const imageToThumbnail = image => {
		const reader = new FileReader();
		reader.readAsDataURL(image);
		reader.onload = () => {
			setThumbnail(reader.result);
		};
	};

	const schema = yup.object({
		title: yup.string().required().min(1).max(50),
		price: yup.number().required().positive(),
		description: yup.string().max(255),
		uses: yup.number().integer().positive(),
		journalist: yup.string().max(255),
	});

	return (
		<>
			<ActionButton
				variant='contained'
				color='green'
				startIcon={<FaPlus />}
				className='btn p-3'
				onClick={handleShow}
			>
				<h6 className='p-0 m-0'>Add Image</h6>
			</ActionButton>

			<Modal show={show} onHide={handleClose}>
				<Modal.Header closeButton>
					<Modal.Title>Add Image</Modal.Title>
				</Modal.Header>
				<Modal.Body className='d-flex justify-content-center'>
					<ThemeProvider theme={theme}>
						<Formik
							validationSchema={schema}
							initialValues={{
								title: '',
								price: '',
								description: '',
								uses: 1,
								journalist: '',
							}}
							onSubmit={async (data, { setSubmitting }) => {
								setSubmitting(true);
								const { title, price, description, uses, journalist } = data;

								let GPSLatitude, GPSLongitude, Model;

								if (image) {
									({ GPSLatitude, GPSLongitude, Model } = await exifr.parse(
										image,
										true
									));
								}

								try {
									const imageModifiedDate = image?.lastModified
										? DateTime.fromMillis(image.lastModified)
												.setZone('Europe/Stockholm')
												.toJSDate()
												.toLocaleString('en-US', {
													timeZone: 'Europe/Stockholm',
												})
										: null;

									const isoModifiedDate = imageModifiedDate
										? new Date(imageModifiedDate)
										: null;
									if (isoModifiedDate) {
										isoModifiedDate.setHours(isoModifiedDate.getHours() + 2);
									}
									const isoModifiedDateString = isoModifiedDate
										? isoModifiedDate.toISOString()
										: null;

									const addedImage = await addImage({
										variables: {
											title,
											price: price ? parseFloat(price) : null,
											description,
											uses: uses && distributable ? parseInt(uses) : 0,
											journalist,
											distributable,
											coordinates:
												GPSLatitude && GPSLongitude
													? `${GPSLatitude}, ${GPSLongitude}`
													: null,
											camera_type: Model,
											image_file: image || null,
											format: image?.type || null,
											last_modified: image?.lastModified
												? isoModifiedDateString
												: null,
											size: image?.size || null,
										},
										refetchQueries: [
											{
												query: GET_LATEST_VERSION_IMAGES,
											},
										],
									});

									const { image_id } = addedImage?.data?.addImage;

									for (const tagName of Array.from(tags)) {
										await createImageTag({
											variables: {
												image_id,
												name: tagName,
											},
											refetchQueries: [
												{
													query: GET_IMAGE_TAGS,
												},
												{
													query: GET_IMAGES_BY_TAG_NAME,
													variables: {
														tag_name: tagName,
													},
												},
											],
										});
									}
								} catch (error) {
									console.log(error);
								}

								setSubmitting(false);
								handleClose();
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
											name='price'
											label='price'
											placeholder='price'
											type='input'
											as={TextField}
											autoComplete='off'
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
									<div className='textfield'>
										<MyTagTextField
											name='tags'
											className='mr-3'
											label='tags'
											autoComplete='off'
											placeholder='tags'
											type='input'
											value={tagInputValue}
											onChange={e => setTagInputValue(e.target.value)}
											onKeyDown={e => {
												if (e.key === 'Enter') {
													e.preventDefault();
													handleAddTag(e.target.value);
													e.target.value = '';
												}
											}}
										/>
										<Button
											onClick={() => {
												handleAddTag(tagInputValue);
											}}
											variant='primary'
											className='ml-auto'
										>
											<FaPlus />
										</Button>
										{tags && tags.size > 0 && (
											<div className='tagContainer'>
												<ul className='list-unstyled d-flex flex-wrap mt-3'>
													{Array.from(tags).map((tag, index) => (
														<li key={index}>
															<Badge className='badge-info mr-2 mb-2'>
																{tag}{' '}
																<Button
																	variant='light'
																	size='sm'
																	onClick={() =>
																		handleRemoveTag(index, tags, setTags)
																	}
																>
																	<FaTimes />
																</Button>
															</Badge>
														</li>
													))}
												</ul>
											</div>
										)}
									</div>
									<div className='checkboxfield'>
										Distributable:
										<Checkbox
											onChange={e => {
												setDistributable(e.target.checked);
											}}
										/>
									</div>
									{distributable && (
										<div className='textfield'>
											<MyTextField
												name='uses'
												autoComplete='off'
												label='uses'
												placeholder='uses'
												type='input'
												as={TextField}
											/>
										</div>
									)}
									<div className='textfield'>
										<MyTextField
											autoComplete='off'
											name='journalist'
											label='journalist'
											placeholder='journalist'
											type='input'
											as={TextField}
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
												<Button
													variant='secondary'
													onClick={() => {
														setImage(null);
														setThumbnail(null);
													}}
												>
													<FaTrash />
												</Button>
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
									<Modal.Footer>
										<Button
											color='primary'
											disabled={isSubmitting}
											type='submit'
											className='form-button'
										>
											Save Changes
										</Button>
										<Button variant='secondary' onClick={handleClose}>
											Close
										</Button>
									</Modal.Footer>
								</Form>
							)}
						</Formik>
					</ThemeProvider>
				</Modal.Body>
			</Modal>
		</>
	);
};
export default AddImageModal;
