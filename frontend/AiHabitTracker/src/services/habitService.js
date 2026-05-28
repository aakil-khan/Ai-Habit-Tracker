import axios from "axios";

const API_URL = "http://localhost:5000/api/habits";

export const getHabits = async () => {

  const response = await axios.get(API_URL);

  return response.data;
};