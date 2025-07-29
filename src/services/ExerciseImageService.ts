import type ExerciseImage from "@/models/ExerciseImage";
import api from "@/config/api/ApiConfig";

class ExerciseImageService {
  /**
   * Creates exercise image with associated exxercise, image must be a Blob and exercise must not contain any id
   * @param exerciseImage Blob to create
   * @param exerciseId Exercise id associated with the image
   * @return promise @type { Promise<ExerciseImage> }
   */
  async create(
    exerciseImage: Blob,
    exerciseId: number,
    position: number
  ): Promise<ExerciseImage> {
    const formData = new FormData();

    formData.append("exerciseImage", exerciseImage);
    formData.append("exerciseId", exerciseId.toString());
    formData.append("position", position.toString());

    const { data } = await api.post("/exercise-images", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return data;
  }
  /**
   * Updates exercise image with associated exercise, must contain an id
   * @param id  ExerciseImage id to update
   * @param exerciseImage Blob to update
   * @param exerciseId Exercise id associated with the image
   * @returns promise @type { Promise<ExerciseImage> }
   */

  async update(
    id: number,
    exerciseImage: Blob,
    exerciseId: number
  ): Promise<ExerciseImage> {
    const formData: FormData = new FormData();
    formData.append("exerciseImage", exerciseImage);
    formData.append("exerciseId", exerciseId.toString());
    return api.put(`/exercise-images/${id}`, formData);
  }

  /**
   * Returns exercise images with associated exercise
   * @param id Exercise id associated with the images
   * @returns promise @type { Promise<ExerciseImage[]> }
   */
  async findByExerciseId(id: number): Promise<ExerciseImage[]> {
    const { data } = await api.get(`/exercise-images?exercise-id=${id}`);
    return data;
  }

  /**
   * Deletes exercise image with a specific id
   * @param id the id to delete
   * @return promise @type { Promise<void> }
   */
  async deleteById(id: number): Promise<void> {
    await api.delete(`/exercise-images/${id}`);
  }
}

export default new ExerciseImageService();
