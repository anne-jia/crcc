function cascaderChose(el, binding) {
  let children=$(el).parent().parent().children();
  if( !(el.className.includes(binding.value))){
      children.each((index,element)=>{
        if(element.className==='el-checkbox'){
          $(element).hide()
        }
    })
  }
  }
const choseHide= Vue.directive('choseHide',{
    inserted(el, binding) {
        cascaderChose(el, binding)
      },
      update(el, binding) {
        cascaderChose(el, binding)
      }
})
export default choseHide