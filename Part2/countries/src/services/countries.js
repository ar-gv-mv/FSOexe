import axios from 'axios'

const baseUrl = 'https://studies.cs.helsinki.fi/restcountries/api'
const getAll = async () => {
  const res = await axios.get(`${baseUrl}/all`)
  console.log(res)
  return res.data
}
export default { getAll }
