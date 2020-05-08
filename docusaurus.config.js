const path = require('path')

module.exports = {
  title: 'Iotes',
  tagline: 'An IOT adaptor for JavaScript',
  url: 'https://your-docusaurus-test-site.com',
  baseUrl: '/',
  favicon: 'img/iotes-favicon.png',
  organizationName: 'seamusfoley', // Usually your GitHub org/user name.
  projectName: 'iotes', // Usually your repo name.
  plugins: [path.resolve(__dirname, 'src/plugins/mqttjs')],
  themeConfig: {
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
        /*{
          to: 'docs/introduction/examples', 
          activeBasePath: 'introduction',
          label: 'API',
          position: 'right'
        },
        {
          to: 'docs/introduction/core-concepts',
          activeBasePath: 'introduction', 
          label: 'FAQ',
          position: 'right'
        },*/
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
          title: 'Docs',
          items: [
            {
              label: 'Style Guide',
              to: 'docs/doc1',
            },
            {
              label: 'Second Doc',
              to: 'docs/doc2',
            },
          ],
        },
        {
          title: 'More',
          items: [
            {
              label: 'GitHub',
              href: 'https://github.com/facebook/docusaurus',
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
