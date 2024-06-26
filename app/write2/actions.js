'use server';
async function handleSubmit(formData) {
  //클라이언트 컴포넌트에서 Import해서 쓸수있음
  console.log(formData.get('mynameis'));
}
