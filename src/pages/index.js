import React from 'react';
import classnames from 'classnames';
import Layout from '@theme/Layout';
import Mdx from '@theme/MDXComponents';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import useBaseUrl from '@docusaurus/useBaseUrl';
import styles from './styles.module.css';

const features = [
  {
    description: 'Designed to work with declaritive UI systems',
    imageUrl: `/img/list.svg`,
    title: 'Declaritive',
  },
  {
    description: 'No external dependencies in the core',
    imageUrl: `/img/box.svg`,
    title: 'Small',
  },
  {
    description: 'Can be used with many different protocols through connection strategies',
    imageUrl: `/img/link.svg`,
    title: 'Compatible',
  },
  {
    description: 'Easy to extend for specfic applications',
    imageUrl: `img/cog.svg`,
    title: 'Extendable',
  }
]

function Feature({imageUrl, title, description}) {
  const imgUrl = useBaseUrl(imageUrl);
  return (
    <div className={classnames('col col--3', styles.feature)}>
      {imgUrl && (
        <div className="text--center">
          <img className={styles.featureImage} src={imgUrl} alt={title} />
        </div>
      )}
      <h3>{title}</h3>
      <p>{description}</p>
    </div>
  );
}

const Logo = props => {
  return (
    <div className="projectLogo">
      <img src={props.logoSrc} alt="Iotes Logo" />
    </div>
  )
}

const VersionWarning = () => (
  <div className={styles.versionWarning}>
    <div className={classnames('container padding-vert--lg')}>
      <div className={classnames('row')} style={{justifyContent: 'center'}}>
          <h2 style={{margin: '1em'}}>
            Iotes is in alpha and not yet ready for production use
          </h2>
        </div>
      </div>
    </div>
)

function Home() {
  const context = useDocusaurusContext();
  const {siteConfig = {}} = context;
  return (
    <Layout
      title={`${siteConfig.title}`}
      description={siteConfig.tagline}>
      <header className={classnames('hero hero', styles.heroBanner)}>
        <div className="container">
          <Logo logoSrc={`/img/iotes-logo-colour.svg`} />
          <h1 className="hero__title">{siteConfig.title}</h1>
          <p className="hero__subtitle">{siteConfig.tagline}</p>
          <div className={styles.buttons}>
            <Link
              className={classnames(
                'button button--outline button--secondary button--lg',
                styles.getStarted,
              )}
              to={useBaseUrl('docs/introduction/getting-started')}>
              Get Started
            </Link>
          </div>
          <div style={{margin: '1.5em 0' }}>
            <img src='https://img.shields.io/npm/v/@iotes/core' style={{ margin: '0 0.5em' }}/>
            <img src='https://img.shields.io/npm/l/@iotes/core' style={{ margin: '0 0.5em' }}/>
            <img src='https://img.shields.io/github/workflow/status/iotes/core/release/master' style={{ margin: '0 0.5em' }}/>
          </div>
        </div>
      </header>
      <main>
        <VersionWarning />
        {features && features.length && (
          <section className={styles.features}>
            <div className="container">
              <div className="row">
                {features.map((props, idx) => (
                  <Feature key={idx} {...props} />
                ))}
              </div>
            </div>
          </section>
        )}
      </main>
    </Layout>
  );
}

export default Home;
