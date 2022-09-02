import Cluster from 'cluster';

const workerId = Cluster.worker?.id;

export default {
  workerId,
};
