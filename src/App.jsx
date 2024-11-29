import { useEffect, useState } from "react"
import 'remixicon/fonts/remixicon.css'
import firebaseConfigApp from '../src/util/firebase-config'
import { getFirestore, addDoc, collection, getDocs, getDoc, doc, deleteDoc, updateDoc } from "firebase/firestore"
import Swal from "sweetalert2"

const db = getFirestore(firebaseConfigApp)

function App() {

    const model = {
        employeename : '',
        salary : '',
        date : ''
    }

    const [employees, setEmployess] = useState(model)
    const [isEmpty, setIsEmpty] = useState(false)
    const [employeeData, setEmployeeData] = useState([])
    const [edit, setEdit] = useState(null)

    useEffect(()=>{
        const getEmployess = async () => {
            const snapshot = await getDocs(collection(db, 'employees'))
            setIsEmpty(snapshot.empty)
            let tem = []
            snapshot.forEach((item) => {
                const documents = item.data()
                documents.uid = item.id
                tem.push(documents)
                
            })
            setEmployeeData(tem)
        }

        getEmployess()
    }, [isEmpty, employeeData])

    const handelChange = (e) => {
        const input = e.target;
        const name = input.name;
        const value = input.value
        setEmployess({
            ...employees,
            [name] : value
        })
    }

    const createEmployees = async (e) => {
        try{
            e.preventDefault()
            await addDoc(collection(db, 'employees'), employees)
            setIsEmpty(false)
            new Swal({
                title: 'Success',
                text: 'Employee created successfully',
                icon: 'success',
                confirmButtonText: 'OK'
            })
        }catch(err){
            new Swal({
                title: 'Error',
                text: 'Error creating employee ' + err.message,
                icon: 'error',
                confirmButtonText: 'OK'
            })
        }finally{
            setEmployess(model)
        }
    }

    const deleteEmployee = async (id) => {
        const ref = doc(db, 'employees', id)
        await deleteDoc(ref)
    }

    const editEmployee = (item) => {
        setEdit(item)
        setEmployess(item)
    }

    const saveEmployee = async (e) => {
        e.preventDefault()
        const ref = doc(db,'employees', edit.uid)
        await updateDoc(ref, employees)
        setEdit(null)
        setEmployess(model)
    }
  return (
    <div className="flex flex-col items-center gap-8 py-8 bg-gray-100 min-h-screen">
        <h1 className="text-4xl font-bold">Firebase <span className="text-[dodgerblue]">CRUD</span></h1>
        <div className="grid grid-cols-3 gap-8 md:w-10/12 border bg-white p-4 rounded-lg shadow-xl">
            <div>
                <form onSubmit={edit ? saveEmployee : createEmployees}>
                    <div className="flex flex-col gap-2">
                        <label className="font-semibold">Employee Name:</label>
                        <input type="text" name="employeename" onChange={handelChange} value={employees.employeename} required className="p-3 rounded border border-gray-300"/>
                    </div>

                    <div className="flex flex-col gap-2 mt-2">
                        <label className="font-semibold">Salary:</label>
                        <input type="number" name="salary" onChange={handelChange} value={employees.salary} required className="p-3 rounded border border-gray-300"/>
                    </div>

                    <div className="flex flex-col gap-2 mt-2">
                        <label className="font-semibold">Date:</label>
                        <input type="date" name="date" required onChange={handelChange} value={employees.date} className="p-3 rounded border border-gray-300"/>
                    </div>
                    {
                        edit ? 
                        <button className="bg-[dodgerblue] text-white rounded py-3 px-6 font-semibold mt-2">Save</button>
                        :
                        <button className="bg-[dodgerblue] text-white rounded py-3 px-6 font-semibold mt-2">Create</button>
                    }
                </form>
            </div>
            <div className="col-span-2">
                {
                    isEmpty &&
                    <div className=" flex flex-col items-center">
                        <i className="ri-file-forbid-line text-3xl text-red-600"></i>
                        <h1 className="font-semibold text-gray-600 text-3xl">Empty</h1>
                    </div>
                }
                <table className="w-full mt-4">
                    <thead>
                        {
                            !isEmpty && 
                            <tr className="bg-[dodgerblue] text-white">
                                <th>S/No</th>
                                <th className="py-2">Employee Name</th>
                                <th>Salary</th>
                                <th>Joining Date</th>
                                <th>Action</th>
                            </tr>
                        }
                    </thead>
                    <tbody>
                        {
                            employeeData.map((item, index) => (
                                <tr className="text-center bg-gray-100 border-b border-gray-300 capitalize" key={index}
                                    style={{
                                        background: (index+1)%2 === 0 ? 'white' : '#f3f4f6'
                                    }}
                                >
                                    <td className="py-2">{index + 1}</td>
                                    <td>{item.employeename}</td>
                                    <td>₹{item.salary}</td>
                                    <td>{item.date}</td>
                                    <td>
                                        <div>
                                            <button onClick={()=>editEmployee(item)} title="edit" className="py-1 px-2 mr-2 bg-[dodgerblue] text-white rounded">
                                                <i className="ri-edit-line"></i>
                                            </button>
                                            <button onClick={()=>deleteEmployee(item.uid)} title="delete" className="py-1 px-2 bg-red-600 text-white rounded">
                                                <i className="ri-delete-bin-6-line"></i>
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        }
                        
                    </tbody>
                </table>
            </div>
        </div>
    </div>
  )
}

export default App
