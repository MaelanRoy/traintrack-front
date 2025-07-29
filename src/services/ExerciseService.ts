import type Exercise from "@/models/Exercise";
import api from "@/config/api/ApiConfig";

class ExerciseService {
  /**
   * Returns exercises
   * @return promise @type { Promise<Exercise[]> }
   */
  async findAll(): Promise<Exercise[]> {
    const { data } = await api.get(`/exercises`);
    return data;
  }

  /**
   * Returns exercise with a specific id
   * @param id the id to retrieve
   * @return promise @type { Promise<Exercise> }
   */
  async findById(id: number): Promise<Exercise> {
    const { data } = await api.get(`/exercises/${id}`);
    return data;
  }

  /**
   * Returns random exercises from all categories
   * @param limitPerCategory the number of exercises per category (default: 4)
   * @return promise @type { Promise<Exercise[]> }
   */
  async findRandomExercisesFromAllCategories(
    limitPerCategory: number = 4
  ): Promise<Exercise[]> {
    const { data } = await api.get(
      `/exercises/random-by-categories/${limitPerCategory}`
    );
    return data;
  }

  /**
   * Deletes exercise with a specific id
   * @param id the id to delete
   * @return promise @type { Promise<void> }
   */
  async deleteById(id: number): Promise<void> {
    await api.delete(`/exercises/${id}`);
  }

  /**
   * Creates exercise, must not contain any id
   * @param exercise exercise to create
   * @return promise @type { Promise<Exercise> }
   */
  async create(exercise: Exercise): Promise<Exercise> {
    if (exercise.id) {
      throw new Error("Should not have an id to create it");
    }
    const { data } = await api.post("/exercises", exercise);
    return data;
  }

  /**
   * Updates exercise, must contain an id
   * @param exercise exercise to update
   * @return promise @type { Promise<Exercise> }
   */
  async update(exercise: Exercise): Promise<Exercise> {
    if (!exercise.id) {
      throw new Error("Must have an id to update it");
    }
    const { data } = await api.put(`/exercises/${exercise.id!}`, exercise);
    return data;
  }
}

export default new ExerciseService();
