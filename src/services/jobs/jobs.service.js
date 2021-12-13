import reverseGeocode from 'geo2zip';
import qs from 'qs';
import axios from 'axios';

const JOB_BASE_URL = 'http://api.indeed.com/ads/apisearch?';
const JOB_QUERY_PARAMS = {
  publisher: '4201738803816157',
  format: 'json',
  v: '2',
  latlong: 1,
  radius: 10,
  q: 'javascript',
};

const buildJobsUrl = (zipCode) => {
  const query = qs.stringify({ ...JOB_QUERY_PARAMS, l: zipCode });
  return `${JOB_BASE_URL}${query}`;
};

export const fetchJobs = async (region) => {
  try {
    const zipCodes = await reverseGeocode(region);
    const url = buildJobsUrl(zipCodes[0]);
    const { data } = await axios.get(url);
    return data;
  } catch (err) {
    throw new Error(err.message);
  }
};
