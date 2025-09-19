import dataImages from "../assets/images"
const { logo } = dataImages

const AdminSidebar = () => {
  return (
    <div>
      <div className="">
        <img src={logo} alt="" />
      </div>
    </div>
  )
}

export default AdminSidebar