function redact_item(obj,data){
    $.ajax({
        url: "/api/item",
        method: "PUT",
        headers: {'X-CSRFToken': csrf},
        data: data,
        dataType: 'text',
    }).done(function(response) {
        if(JSON.parse(response).errors === 'false'){
            let item = obj.state.list
            item[find_index(data.old_id,item)] = {id: data.old_id,name: data.name,age: data.age}
            obj.setState({list:item})
        }else{
            for(let i in JSON.parse(response).errors){
                alert(i+': '+JSON.parse(response).errors[i][0].message)
            }
        }
    }).fail(function (error) {
        console.log(error);
    });
}

function add_item(obj,data){
    console.log(data)
    $.ajax({
        url: "/api/item",
        method: "POST",
        headers: {'X-CSRFToken': csrf},
        data: data,
        dataType: 'text',
    }).done(function(response) {
        if(JSON.parse(response).errors === 'false'){
            let item = obj.state.list
            item.unshift({id:JSON.parse(response).new_id,name:data.name,age:data.age})
            obj.setState({list:item});
        }else{
            for(let i in JSON.parse(response).errors){
                alert(i+': '+JSON.parse(response).errors[i][0].message)
            }
        }
    }).fail(function (error) {
        console.log(error);
    });
}

function delete_item(obj,data){
    $.ajax({
        url: "/api/item",
        method: "DELETE",
        headers: {'X-CSRFToken': csrf},
        data: data,
        dataType: 'text',
    }).done(function(response) {
        if(JSON.parse(response).errors === 'false'){
            let item = obj.state.list
            delete item[find_index(data.id,item)]
            obj.setState({list:item})
        }
    }).fail(function (error) {
        console.log(error);
    });
}




class Item extends React.Component {
    constructor(props) {
        super(props);
        this.state = {form_redact: false};
        this.change_form = this.change_form.bind(this);
    }

    change_form(){
        this.setState({form_redact: !this.state.form_redact})
    }


    render() {
        let item = this.props;
        if(this.state.form_redact){
            return(
                <Form_item name={item.name} age={item.age} old_id = {item.id} close={this.change_form} save ={item.save}/>
            )
        }else{
            return (
                <div className="item">
                    <div className="area-id">{item.id}</div>
                    <div className="area-name">{item.name}</div>
                    <div className="area-age">{item.age}</div>
                    <div className="area-redact" onClick={this.change_form}>Редактировать</div>
                    <div className="area-delete" onClick={()=>this.props.delete_item(item.id)}>Удалить</div>
                </div>
            )
        }
    }
}


class Form_item extends React.Component{
    constructor(props) {
        super(props);
        this.state = props;
        this.changeName = this.changeName.bind(this);
        this.changeAge = this.changeAge.bind(this);
        this.close_form = this.close_form.bind(this);
        this.onSubmit = this.onSubmit.bind(this);
    }
    onSubmit(event){
        event.preventDefault();
        this.state.save(this.state.old_id,this.state.name,this.state.age)
        this.close_form()
    }


    changeName(event){
        this.setState({name: event.target.value});
    }

    changeAge(event){
        this.setState({age: event.target.value});
    }

    close_form(){
        this.state.close()
    }


    render() {
        let item = this.state;
        return(
            <form className ="item" onSubmit={this.onSubmit}>
                 <div className ="area-id">{item.old_id}</div>
                <div className ="area-name"><input type="text" value={item.name} onChange={this.changeName}  name="name"/></div>
                <div className ="area-age"><input  type="text" value={item.age} onChange={this.changeAge} name="age"/></div>
                <div className ="area-redact"><input type="submit" value="Сохранить"/></div>
                <div className ="area-delete" onClick={this.close_form}>Отменить</div>
            </form>
        )
    }
}


class Item_list extends React.Component {
    constructor(props) {
        super(props);
        this.state = {list: list_person, sort: 'false',form_append: false};
        this.sort_list = this.sort_list.bind(this);
        this.change_form_append = this.change_form_append.bind(this);
        this.save_form_append = this.save_form_append.bind(this);
        this.redact_item = this.redact_item.bind(this);
        this.delete_item = this.delete_item.bind(this);
    }

    sort_list(name){
        let item = this.state
        if(name === 'id'){
            if(this.state.sort === 'false'){
                item.list.sort((a, b) => +a.id > +b.id ? 1 : -1);
                item.sort = 'id'
            }else{
                item.list.sort((a, b) => +a.id > +b.id ? -1 : 1);
                item.sort = 'false'
            }
        }else if(name === 'name'){
            if(this.state.sort === 'false'){
                item.list.sort((a, b) => a.name > b.name ? 1 : -1);
                item.sort = 'name'
            }else{
                item.list.sort((a, b) => a.name > b.name ? -1 : 1);
                item.sort = 'false'
            }
        }else if(name === 'age'){
            if(this.state.sort === 'false'){
                item.list.sort((a, b) => +a.age > +b.age ? 1 : -1);
                item.sort = 'age'
            }else{
                item.list.sort((a, b) => +a.age > +b.age ? -1 : 1);
                item.sort = 'false'
            }
        }
        this.setState(item);
    }

    save_form_append(old_id,name,age){
        add_item(this,{name:name,age:age})
    }

    change_form_append(){
        this.setState({form_append: !this.state.form_append})
    }

    redact_item(old_id,name,age){
        redact_item(this,{old_id:old_id,name:name,age:age})
    }

    delete_item(id){
        delete_item(this,{id:id});
    }

    render() {
        let item = this.state;
        const listItems = item.list.map((item) =>
            <Item key={item.id} name={item.name} id={item.id} age={item.age} save={this.redact_item} delete_item={this.delete_item}/>
        );
        return(
            <div className='area-list'>
                <div className="item">
                    <div className="area-id" onClick={()=>this.sort_list('id')}>ID</div>
                    <div className="area-name" onClick={()=>this.sort_list('name')}>Name</div>
                    <div className="area-age" onClick={()=>this.sort_list('age')}>Age</div>
                    <div className="area-add" onClick={this.change_form_append}>{(item.form_append === false)?(<div>Добавить запись</div>):(<div>Отменить</div>)}</div>
                </div>
                {item.form_append !== false &&
                    <Form_item name='' age=''  old_id = {false} close={this.change_form_append} save={this.save_form_append}/>
                }
                {listItems}
            </div>
        )
    }
}

function find_index(id,list){
    for(let i in list){
        if(list[i].id == id){
            return i
        }
    }
}

ReactDOM.render(
    <Item_list />,
    document.getElementById('area_list')
);

