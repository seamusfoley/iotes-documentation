import React from 'react'

export const GithubLink: React.FC<{href: string}> = (props = {
  href: 'https://github.com/iotes'
}) => (
  <a className={'githublink'} style={{ display: 'flex', alignItems: 'center', padding: '0.3rem 0' }} href={props.href} target='_blank'>
    <div className={'img'} style={{ marginRight: '1rem', height: '32px', width: '32px' }} />
    <p style={{ paddingTop: '20px' }}>On Github</p>
  </a>
)