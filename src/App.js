
// 컴포넌트 이름은 꼭! 대문자로

/*
  prop - 속성
  
  자동으로 생성된 컴포넌트는 고유한 key 값이 필요
*/

import {useState} from 'react'


function Header(props)  {
  return (
    <header>
        <h1><a href='/' onClick={((event)=>{
          event.preventDefault(); // a태그 이벤트 막기
          props.onChangeMode();
        })}>{props.title}</a></h1>
    </header>
  )
}

function Nav(props) {
  
  const t = props.topics;
  
  const lis = []

  for(let i=0; i<t.length; i++){
    lis.push(
      <li key={t[i].id}>
        <a id={t[i].id} href={'/read/'+t[i].id} onClick={(event)=>{
          event.preventDefault();
          props.onChangeMode(Number(event.target.id))
        }}>{t[i].title}</a>
      </li>
    )
  }

  return (
    <nav>
      <ol>
        {lis}
      </ol>
    </nav>
  )
}


function Acticle(props) {
  return (
    <article>
      <h2>{props.title}</h2>
      {props.body}
    </article>
  )
}

function Create(props){
  return(
    <article>
      <h2>Create</h2>
      <form onSubmit={(event)=>{
        event.preventDefault();
        
        const title = event.target.title.value;
        const body = event.target.body.value;

        props.onCreate(title, body);
      }}>
        <p><input type="text" name="title" placeholder="title"/></p>
        <p><textarea name="body" placeholder="body"></textarea></p>
        <p><input type="submit" value="Create"/></p>
      </form>
    </article>
  )
}


function Update(props){
  const [title, setTitle] = useState(props.title);
  const [body, setBody] = useState(props.body)

  return(
    <article>
      <h2>Update</h2>
      <form onSubmit={(event)=>{
        event.preventDefault();
        
        const title = event.target.title.value;
        const body = event.target.body.value;

        props.onUpdate(title, body);
      }}>
        <p><input type="text" name="title" placeholder="title" value={title} onChange={event=>{
          setTitle(event.target.value);
        }}/></p>
        <p><textarea name="body" placeholder="body" value={body} onChange={event=>{
          setBody(event.target.value);
        }}></textarea></p>
        <p><input type="submit" value="Update"/></p>
      </form>
    </article>
  )
}



function App() {
  // const _mode = useState('Welcome');
  // const mode = _mode[0]     // value
  // const setMode = _mode[i]  // function
  const [mode, setMode] = useState('WELCOME');

  const [id, setId] = useState(null);

  let contextControl = null;

  const [topics, setTopics] = useState([
    {id:1, title:'html', body:'html is ...'},
    {id:2, title:'css', body:'css is ...'},
    {id:3, title:'js', body:'js is ...'}
  ])

  let content = null;

  

  if(mode === 'WELCOME'){
    content = <Acticle title='Welcome' body='Hello, WEB'></Acticle>
  } else if(mode === "READ"){
    let title, body = null;

    for(let i=0; i<topics.length; i++){
      if(topics[i].id === id){
        title = topics[i].title;
        body = topics[i].body;
      }
    }
    
    content = <Acticle title={title} body={body}></Acticle>

    contextControl = <span>
        <a href='/update' onClick={event=>{
          event.preventDefault();
          setMode("UPDATE");
          
        }}>Update</a>
        &nbsp;
        <a href='/delete' onClick={event=>{
          event.preventDefault();
          setMode("DELETE");
          
        }}>Delete</a>
      </span>

  } else if(mode ===  "CREATE"){
    content = <Create onCreate={(_title, _body)=>{
      const createTopic = [...topics]
      let nextId = topics.length+1
      createTopic.push({id:nextId, title:_title, body:_body})
      setTopics(createTopic)

      setMode("READ")
      setId(nextId)
    }}></Create>


  } else if(mode ===  "UPDATE"){
    let title, body = null;
    let index = null;

    for(let i=0; i<topics.length; i++){
      if(topics[i].id === id){
        title = topics[i].title;
        body = topics[i].body;

        index = i;
      }
    }

    content = <Update title={title} body={body} onUpdate={(_title, _body)=>{
      const updateTopic = [...topics]
      updateTopic[index].title = _title;
      updateTopic[index].body = _body;
      setTopics(updateTopic)

      setMode("READ")
      setId(id)
    }}></Update>

  } else if(mode === "DELETE"){
    let index = null;

    for(let i=0; i<topics.length; i++){
      if(topics[i].id === id){
        index = i;
      }
    }

    const deleteTopic = [...topics]
    deleteTopic.splice(index, 1);
    setTopics(deleteTopic)

    setMode("WELCOME")
  }



  
  return (
    <div className="App">
      <Header title="WEB" onChangeMode={()=>{
        setMode("WELCOME")
      }}></Header>
      <Nav topics={topics} onChangeMode={(_id)=>{
        setMode("READ")
        setId(_id)
      }}></Nav>
      {content}

      <a href='/create' onClick={(event)=>{
        event.preventDefault();
        setMode('CREATE')
      }}>Create</a>
      &nbsp;
      {contextControl}
    </div>
  );
}

export default App;
