import { useMutation } from '@apollo/client';
import { FaTrash } from 'react-icons/fa';
import { DELETE_REQUESTED_IMAGE } from '../mutations/imageMutations';
import { GET_REQUESTED_IMAGES } from '../queries/imageQueries';
import '../scss/AdminImageCard.scss';
import ActionButton from './ActionButton';

export const handleDeleteButtonClick = async (
	requested_image_id,
	deleteRequestedImage
) => {
	await deleteRequestedImage({
		variables: {
			requested_image_id,
		},
		update(cache, { data: { deleteRequestedImage } }) {
			const { requested_images } =
				cache.readQuery({
					query: GET_REQUESTED_IMAGES,
				}) || {};

			if (requested_image_id) {
				cache.writeQuery({
					query: GET_REQUESTED_IMAGES,
					data: {
						requested_images: requested_images.filter(
							reqImg => reqImg.requested_image_id !== requested_image_id
						),
					},
				});
			}
		},
	});
};

const AdminImageRequestCard = ({ image }) => {
	const { requested_image_id, image_url, title, description, journalist } =
		image;

	const [deleteRequestedImage] = useMutation(DELETE_REQUESTED_IMAGE);

	return (
		<>
			<div className='card h-100 mt-3'>
				<img
					className='card-img-top'
					alt={requested_image_id}
					src={image_url}
				/>
				<div className='card-body'>
					<h5 className='card-title fs-4'>{title}</h5>
					<p className='card-text fs-6'>{description}</p>
				</div>
				<ul className='list-group list-group-flush'>
					<li className='list-group-item border-bottom'>
						Journalist: {journalist || '\u2014'}
					</li>
				</ul>

				<div className='card-body d-flex align-items-end'>
					<ActionButton
						variant='outlined'
						color='secondary'
						className='btn w-100 p-3'
						startIcon={<FaTrash />}
						onClick={() =>
							handleDeleteButtonClick(requested_image_id, deleteRequestedImage)
						}
					>
						Delete image
					</ActionButton>
				</div>
			</div>
		</>
	);
};
export default AdminImageRequestCard;
