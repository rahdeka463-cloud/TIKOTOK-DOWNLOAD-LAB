import axios from 'axios';
async function test() {
  const result = await axios.get('https://instances.cobalt.tools/api/instances');
  console.log("Instances:", result.data.map(i => i.domain));
}
test();
