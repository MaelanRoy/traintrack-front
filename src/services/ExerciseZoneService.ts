import type ExerciseZone from "@/models/ExerciseZone";
import api from "@/config/api/ApiConfig";

class ExerciseZoneService {
  /**
   * Returns exercise zones
   * @return promise @type { Promise<ExerciseZone[]> }
   */
  async findAll(): Promise<ExerciseZone[]> {
    const { data } = await api.get(`/exercise-zones`);
    return data;
  }
}

export default new ExerciseZoneService();
