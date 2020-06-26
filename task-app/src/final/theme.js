export const darkTheme = () => {
  return {
    styles: {
      backgroundColor: `#151230`,
      color: `#FFFFFF`
    }
  }
};
export const lightTheme = () => {
  return {
    styles: {
      backgroundColor: `#f0f5f6`,
      color: `#151230`
    }
  }
};
const columns = (columns) => {
  return {
    flexGrow: columns,
    paddingRight: DefaultTheme().position.gutter,
    paddingLeft: DefaultTheme().position.gutter
  }
}
const sizes = {
  gutter: `10px`
}
const DefaultTheme = () => {
  return {
    styles: {
      ...lightTheme().styles
    },
    borderStyle: {
      border: `1px solid #c3c3c3`
    },
    position: {
      container: {
        display: `flex`
      },
      columns: columns,
      gutter: sizes.gutter,
    },
    region: {
      padding: sizes.gutter
    }
  };
}

const Theme = DefaultTheme;

export default Theme;
