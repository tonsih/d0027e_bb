import { useLazyQuery, useMutation, useQuery } from '@apollo/client';
import {
	FaCheckCircle,
	FaHistory,
	FaTimesCircle,
	FaTrash,
} from 'react-icons/fa';
import { DELETE_IMAGE } from '../mutations/imageMutations';
import {
	GET_IMAGE_TAGS_BY_IMAGE_ID,
	GET_IMAGE_TAGS,
	GET_LATEST_VERSION_IMAGES,
	GET_TECHNICAL_METADATA,
	GET_IMAGES_BY_TAG_NAME,
} from '../queries/imageQueries';
import ActionButton from './ActionButton';
import EditImageModal from './EditImageModal';
import MetadataModal from './MetadataModal';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import {
	USER_SHOPPING_CART,
	USER_SHOPPING_CART_IMAGES,
} from '../queries/shoppingCartQueries';
import { useEffect, useState } from 'react';
import _ from 'lodash';
import { StyledLink } from '../style/styledComponents/StyledLink';
import '../scss/AdminImageCard.scss';
import { handleDeleteButtonClick } from './AdminImageRow';

const AdminImageCard = ({ image }) => {
	const {
		image_id,
		image_url,
		title,
		price,
		uses,
		description,
		journalist,
		distributable,
	} = image;
	const [deleteImage] = useMutation(DELETE_IMAGE, {
		// refetchQueries: [
		// 	{ query: GET_LATEST_VERSION_IMAGES },
		// 	{ query: GET_IMAGE_TAGS },
		// ],
	});

	const { user, isLoading, isError, isSuccess, message } = useSelector(
		state => state.auth
	);

	const [imgTagNames, setImgTagNames] = useState([]);

	const {
		data: tmData,
		error,
		loading,
	} = useQuery(GET_TECHNICAL_METADATA, {
		variables: { image_id },
	});

	const [getITBIData, { data: itbiData }] = useLazyQuery(
		GET_IMAGE_TAGS_BY_IMAGE_ID
	);

	useEffect(() => {
		const getITBIDataFunc = async () => {
			await getITBIData({
				variables: {
					image_id,
				},
			});
		};

		if (image_id) {
			getITBIDataFunc();
		}
	}, [image_id]);

	useEffect(() => {
		if (itbiData?.image_tags_by_image_id) {
			for (let imgTag of itbiData?.image_tags_by_image_id) {
				const { name: imgTagName } = imgTag?.tag;
				setImgTagNames([...imgTagNames, imgTagName]);
			}
		}
	}, [itbiData?.image_tags_by_image_id]);

	return (
		<>
			<div className='card h-100 mt-3'>
				{/* <StyledLink to={`/image/${image_id}`} key={image_id} className='w-100'> */}
				<img
					className='card-img-top'
					alt={image_id}
					src={image_url || 'https://placehold.co/500x400'}
				/>
				<div className='card-body'>
					<h5 className='card-title fs-4'>{title}</h5>
					<p className='card-text fs-6'>{description}</p>
				</div>
				<ul className='list-group list-group-flush'>
					<li className='list-group-item border-top'>ID: {image_id}</li>
					<li className='list-group-item border-top'>Price: ${price}</li>
					<li className='list-group-item border-bottom'>
						Distributable:{' '}
						{distributable ? <FaCheckCircle /> : <FaTimesCircle />}
					</li>
					<li className='list-group-item border-bottom'>No. uses: {uses}</li>
					<li className='list-group-item border-bottom'>
						Journalist: {journalist || '\u2014'}
					</li>
				</ul>

				{tmData?.technical_metadata_by_image_id?.technical_metadata_id && (
					<div className='card-body d-flex align-items-end'>
						<MetadataModal
							metadata={tmData?.technical_metadata_by_image_id}
							image={image}
							adminImageCard={true}
						/>
					</div>
				)}

				<div className='card-body d-flex align-items-end'>
					<Link to={`/version-history/${image_id}`} className='w-100'>
						<ActionButton
							variant='outlined'
							color='primary'
							className='btn w-100 p-3'
							startIcon={<FaHistory />}
						>
							Version history
						</ActionButton>
					</Link>
				</div>

				<div className='card-body d-flex align-items-end'>
					<EditImageModal imageToEdit={image} adminImageCard={true} />
				</div>

				<div className='card-body d-flex align-items-end'>
					<ActionButton
						id='delete-image-button'
						variant='outlined'
						color='secondary'
						className='btn w-100 p-3'
						startIcon={<FaTrash />}
						onClick={() =>
							handleDeleteButtonClick(imgTagNames, user, image_id, deleteImage)
						}
					>
						Delete image
					</ActionButton>
				</div>

				{/* </StyledLink> */}
			</div>
		</>
	);
};
export default AdminImageCard;
