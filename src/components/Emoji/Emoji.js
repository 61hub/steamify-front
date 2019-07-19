import React from 'react'

export const Emoji = ({ type, ...rest }) => <span role="img" aria-label="emoji" {...rest}>{type}</span>
