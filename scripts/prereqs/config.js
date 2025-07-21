/**
 * Configuration for prerequisite tools
 */

const REQUIRED_TOOLS = [
  {
    name: 'Node.js',
    command: 'node --version',
    minVersion: '18.0.0',
    installUrl: 'https://nodejs.org/'
  },
  {
    name: 'npm',
    command: 'npm --version',
    minVersion: '9.0.0',
    installUrl: 'https://nodejs.org/'
  },
  {
    name: 'Docker',
    command: 'docker --version',
    minVersion: '20.0.0',
    installUrl: 'https://www.docker.com/products/docker-desktop'
  },
  {
    name: 'Docker Compose',
    command: 'docker compose version',
    minVersion: '2.0.0',
    installUrl: 'https://docs.docker.com/compose/install/'
  },
  {
    name: 'Git',
    command: 'git --version',
    minVersion: '2.0.0',
    installUrl: 'https://git-scm.com/'
  }
];

module.exports = { REQUIRED_TOOLS };