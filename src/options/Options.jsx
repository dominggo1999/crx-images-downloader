import React from 'react';
import tw, { styled } from 'twin.macro';

export const Box = styled.div`
  ${tw`
    w-full 
    h-screen 
    bg-black 
    flex 
    justify-center
    items-center
    text-white
    text-2xl
  `}
`;

const Options = () => {
  return (
    <Box>
      This is options page
    </Box>
  );
};

export default Options;
