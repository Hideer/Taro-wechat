export const show = () => {
  return {
    type: 'SHOW'
  };
};
export const hide = () => {
  return {
    type: 'HIDE'
  };
};

// 异步的action
// export function asyncAdd() {
//   return dispatch => {
//     setTimeout(() => {
//       dispatch(add());
//     }, 2000);
//   };
// }
