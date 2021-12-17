import qs from 'qs';
import axios from 'axios';

import { INDEED_PUBLISHER_ID } from '../../utils';

const JOB_BASE_URL = 'https://api.indeed.com/ads/apisearch?';
const JOB_QUERY_PARAMS = {
  publisher: INDEED_PUBLISHER_ID,
  format: 'json',
  v: '2',
  latlong: 1,
  radius: 10,
  limit: 10,
};

const buildJobsUrl = (zipCode, jobTitle = 'javascript') => {
  const query = qs.stringify({ ...JOB_QUERY_PARAMS, l: zipCode, q: jobTitle });
  return `${JOB_BASE_URL}${query}`;
};

export const fetchJobs = async (zipCode, jobTitle) => {
  try {
    const url = buildJobsUrl(zipCode, jobTitle);
    const { data } = await axios.get(url);
    if (data.error) throw new Error(data.error);
    return data.results;
  } catch (err) {
    throw new Error(err.message);
  }
};
