import { FiTrash } from 'react-icons/fi';
import { api } from './services/api';
import { useState, useEffect, useRef, FormEvent } from 'react';

interface JobsProps{
  name: string;
  email: string;
  status: boolean;
  created_at: string;
  id: string;
}

export default function App() {

  const [jobs, setJobs] = useState<JobsProps[]>([]);
  const nameRef = useRef<HTMLInputElement | null>(null);
  const emailRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    loadMac();
  },[]);

  async function loadMac(){
    const response = await api.get('/customers')
    setJobs(response.data);
  };

  async function handleSubmit(e: FormEvent){
    e.preventDefault();

    if(!nameRef.current?.value || !emailRef.current?.value){
      alert('Preencha todos os campos');
      return;
    }

    const response = await api.post('/customer', {
      name: nameRef.current?.value,
      email: emailRef.current?.value
    });

    setJobs(allCustomers => [...allCustomers, response.data]);

    alert('Obra cadastrada com sucesso!');

    nameRef.current.value = '';
    emailRef.current.value = '';

  }

  async function handleDelete(id: string){
    try{
      await api.delete('/customer', {
        params: { id }
      });

      const allJobs = jobs.filter(job => job.id !== id);
      setJobs(allJobs);

      alert('Obra deletada com sucesso!')

    } catch(err){
      console.log(err)
    }
  }


  return (
    <div className="w-full min-h-screen bg-gray-900 flex justify-center px-4">
      <main className="w-full md:max-w-2xl my-10">
        <h1 className="text-4xl font-medium text-white">MAC's CIO</h1>

        <form className="flex flex-col my-6" onSubmit={handleSubmit}>
          <label className="font-medium text-white">Número da obra:</label>
          <input type="text"
          placeholder="Digite o número da obra aqui..."
          className="w-full mb-5 mt-2 p-2 rounded"
          ref={nameRef}/>
          <label className="font-medium text-white">Mac Number:</label>
          <input type="text"
          placeholder="Digite o Mac address aqui..."
          className="w-full mb-5 mt-2 p-2 rounded"
          ref={emailRef}/>

          <input type='submit' value='Cadastrar' className="mb-10 cursor-pointer w-full bg-green-500 rounded font-medium p-2 bold text-white"/>
        </form>

        <section className="flex flex-col">
          {jobs.map( (job) => (
            <article key={job.id} className="w-full bg-white rounded p-2 relative hover:scale-105 duration-200 mb-6">

              <p><span className="font-medium">Número da obra:</span> { job.name }</p>
              <p><span className="font-medium">MAC ADDRESS:</span> { job.email }</p>
              <p><span className="font-medium">STATUS:</span> { job.status ? 'ATIVO' : 'INATIVO' }</p>

              <button onClick={ () => handleDelete(job.id) } className='bg-red-500 w-7 h-7 flex items-center justify-center rounded-lg absolute right-1 -top-2'>
                <FiTrash size={18} color='#FFF'/>

              </button>
          </article>
          ))}
        </section>
      </main>
    </div>
  )
}

