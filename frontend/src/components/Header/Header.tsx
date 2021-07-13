import React from 'react';
import styled from 'styled-components';

const HeaderPointer = styled.div`
    display: flex;
    flex-direction: column;
    position: fixed;
    top: 0px;
    width: 100%;
`;

const Logo = styled.div`
  float: left;
  margin-right 40px;
`


const Header: React.FC = () => {
    return (
        <HeaderPointer>
            <Logo>
                <img src="imgs/logo.png" alt="logo" />
            </Logo>
        </HeaderPointer>
    );
};

export default Header;