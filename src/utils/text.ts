export function toProperCase(str: string | undefined | null): string {
  if (!str) return '';
  const acronyms: Record<string, string> = {
    ai: 'AI',
    ml: 'ML',
    nit: 'NIT',
    nitd: 'NITD',
    iit: 'IIT',
    iiit: 'IIIT',
    mit: 'MIT',
    cmu: 'CMU',
    tum: 'TUM',
    cit: 'CIT',
    bits: 'BITS',
    vit: 'VIT',
    slam: 'SLAM',
    lidar: 'LiDAR',
    ros: 'ROS',
    cv: 'CV',
    gps: 'GPS',
    imu: 'IMU',
    rgb: 'RGB',
    '2d': '2D',
    '3d': '3D',
    '4d': '4D',
    pid: 'PID',
    uav: 'UAV',
    ugv: 'UGV',
    gpu: 'GPU',
    cpu: 'CPU',
    rnd: 'RND',
    pts: 'pts'
  };

  return str
    .split(' ')
    .map(word => {
      if (!word) return '';
      const match = word.match(/^([^a-zA-Z0-9]*)([a-zA-Z0-9'-]+)([^a-zA-Z0-9]*)$/);
      if (!match) return word;
      const prefix = match[1];
      const core = match[2];
      const suffix = match[3];

      const lower = core.toLowerCase();
      if (acronyms[lower]) {
        return prefix + acronyms[lower] + suffix;
      }
      if (core !== core.toUpperCase() && /[A-Z]/.test(core.slice(1))) {
        return prefix + core + suffix;
      }
      const capitalized = core.charAt(0).toUpperCase() + core.slice(1).toLowerCase();
      return prefix + capitalized + suffix;
    })
    .join(' ');
}
