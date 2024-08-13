import { $, cd } from 'zx';

const [name, projectRoot] = process.argv.slice(2);

// $.verbose = false;

cd(projectRoot);

const port = process.env.RESTATE_SERVER_PORT || '9080';

const svcName = `ftgo-${name}`;

// try {
//   await $`kraft cloud service create --name ftgo-${name} -s "${svcName}" 443:${port}/http+tls`;
// } catch {}

const envVars = Object.entries(process.env).reduce((acc, [key, value]) => acc + ' ' + `-e ${key}=${value}`, '');

await $`kraft cloud deploy --rollout remove --restart on-failure --scale-to-zero on --scale-to-zero-cooldown 1000ms --strategy overwrite -M 512 -p ${port}:${port}/http+tls -e RESTATE_SERVER_HOST=${svcName}.internal ${envVars} --name ${svcName} .`;
