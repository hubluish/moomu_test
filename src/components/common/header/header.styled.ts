import styled from "styled-components";
import Link from "next/link";
// 헤더 전체
export const HeaderWrapper = styled.header`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100vw;
  height: 64px;
  padding: 0 32px;
  background: #fff;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.03);
`;
// 로고 영역(이미지+이름)
export const LogoSection = styled.div`
  display: flex;
  align-items: center;
`;
export const LogoImg = styled.img`
  width: 40px;
  height: 40px;
  margin-right: 12px;
`;
export const LogoName = styled.span`
  font-size: 25px;
  font-weight: var(--font-weight-semibold);
  color: var(--color-text-main);
  font-family: var(--font-family-logo);
  letter-spacing: -0.1em;
  height: 40px;
`;
// 네비게이션 영역
export const Nav = styled.nav`
  display: flex;
  gap: 32px;
  align-items: center;
`;
// 네비게이션 링크
export const NavLink = styled(Link)<{ $active: boolean }>`
  position: relative;
  text-decoration: none;
  font: var(--text-body1);
  color: ${({ $active }) => $active ? 'var(--color-main)' : 'var(--color-text-sub)'};
  padding: 0 4px;
  transition: color 0.2s;
  &:hover {
    color: var(--color-point);
  }
  &::after {
    content: ${({ $active }) => $active ? "''" : "none"};
    display: block;
    position: absolute;
    left: 0;
    right: 0;
    bottom: -4px;
    height: 2px;
    background: var(--color-main);
  }
`;
// 오른쪽 영역
export const RightSection = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
`;
// 로그인 버튼
export const LoginButton = styled(Link)`
  font: var(--text-notice);
  padding: 6px 16px;
  border: none;
  border-radius: 4px;
  background: var(--color-main);
  color: #fff;
  cursor: pointer;
  text-decoration: none;
  display: inline-block;
  &:hover {
    background: var(--color-point);
  }
`;
// 계정
export const AccountWrapper = styled.div`
  position: relative;
  display: flex;
  align-items: center;
`;

export const Avatar = styled.img`
  width: 32px;
  height: 32px;
  border-radius: 50%;
`;

// 드롭다운 메뉴
export const Dropdown = styled.div`
  position: absolute;
  top: 48px;
  right: 0;
  background: var(--color-bg);
  border: 1px solid var(--color-outline);
  border-radius: 8px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);
  min-width: 165px;
  z-index: 10;
  padding: 8px 0;
`;
export const DropdownItem = styled(Link)`
  display: block;
  width: 100%;
  padding: 10px 20px;
  color: var(--color-text-sub);
  text-decoration: none;
  font: var(--text-body2);
  background: none;
  text-align: left;
  cursor: pointer;
  &:hover {
    color: var(--color-point);
  }
`;

export const DropdownButton = styled.button`
  display: block;
  width: 100%;
  padding: 10px 20px;
  color: var(--color-text-sub);
  text-decoration: none;
  font: var(--text-body2);
  background: none;
  border: none;
  text-align: left;
  cursor: pointer;
  &:hover {
    color: var(--color-point);
  }
`;