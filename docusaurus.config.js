const path = require('path')

module.exports = {
  title: 'Iotes',
  tagline: 'An IOT adaptor for JavaScript',
  url: 'https://iotes.dev',
  baseUrl: '/',
  favicon: 'img/iotes-favicon.png',
  organizationName: 'seamusfoley', // Usually your GitHub org/user name.
  projectName: 'iotes', // Usually your repo name.
  plugins: [path.resolve(__dirname, 'src/plugins/mqttjs')],
  themeConfig: {
    defaultDarkMode: true,
    prism: {
      theme: require('prism-react-renderer/themes/github'),
      darkTheme: require('prism-react-renderer/themes/vsDark'),
    },
    navbar: {
      title: 'Iotes',
      hideOnScroll: true,
      logo: {
        alt: 'Iotes Logo',
        src: 'img/iotes-logo-colour.svg',
      },
      links: [
        {
          to: 'docs/introduction/what-is-iotes',
          activeBasePath: 'What-is-Iotes', 
          label: 'What Is Iotes?',
          position: 'right'
        },
        {
          to: 'docs/introduction/getting-started', 
          activeBasePath: 'introduction', 
          label: 'Quick Start',
          position: 'right'
        },
        {
          to: 'docs/introduction/examples', 
          activeBasePath: 'introduction',
          label: 'Examples',
          position: 'right'
        },
        {
          to: 'docs/api/topology',
          activeBasePath: 'api', 
          label: 'API',
          position: 'right'
        },
        {

          href: 'https://github.com/seamusfoley/iotes',
          label: 'Github',
          position: 'right',
        },
      ],
    },
    footer: {
      style: 'dark',
      links: [
        {
          title: 'Links',
          items: [
            {
              label: 'GitHub',
              to: 'https://github.com/seamusfoley/iotes',
            },
          ],
        },
      ],
      copyright: `Copyright © ${new Date().getFullYear()} Seamus Foley and wtc`,
    },
  },
  presets: [
    [
      '@docusaurus/preset-classic',
      {
        docs: {
          sidebarPath: require.resolve('./sidebars.js'),
          // Please change this to your repo.
          editUrl:
            'https://github.com/facebook/docusaurus/edit/master/website/',
        },
        blog: {
          showReadingTime: true,
          // Please change this to your repo.
          editUrl:
            'https://github.com/facebook/docusaurus/edit/master/website/blog/',
        },
        theme: {
          customCss: require.resolve('./src/css/custom.css'),
        },
      },
    ],
  ],
};
