import React, { useState, PureComponent, createRef } from 'react';
import $ from 'jquery';

// Store app container in variable
//const appContainer = document.querySelector('#appContainer');
class Modal extends PureComponent {
	modalWrapper = createRef();

	renderHeader = () => {
		const { useModalHeader, modalTitle, modalClosed } = this.props;
		const headerMarkup = (
			<div className="modal-header">
				<h4 className="modal-title">{modalTitle}</h4>
				<button className="close-modal" onClick={modalClosed}>
					×
				</button>
			</div>
		);

		if (typeof useModalHeader !== 'undefined') {
			return useModalHeader && headerMarkup;
		} else {
			return headerMarkup;
		}
	};

	renderFooter = () => {
		const { useModalFooter, modalClosed, footerBtnCloseText, footerBtnCloseListener } = this.props;

		const footerMarkup = (
      <div className="modal-footer">
          <button
          className="close-modal"
          onClick={() => {
            if (footerBtnCloseListener) {
              footerBtnCloseListener();
            }
            modalClosed();
          }}
        >
          {footerBtnCloseText ? footerBtnCloseText : 'close'}
        </button>

			</div>
		);

		if (typeof useModalFooter !== 'undefined') {
			return useModalFooter && footerMarkup;
		} else {
			return footerMarkup;
		}
	};

	render() {
		const { show, modalClosed, children } = this.props;

		return (
			<div
				className={`modal-window ${!show ? 'inactive-modal' : ''}`}
				onClick={(e) => {
					if (e.target === this.modalWrapper.current) {
						modalClosed();
					}
				}}
			>
				<div className="modal-wrapper" ref={this.modalWrapper}>
					<div className={`modal ${show ? 'animate-modal' : ''}`}>
						{this.renderHeader()}
						<div className="modal-body">{children}</div>
						{this.renderFooter()}
					</div>
				</div>
			</div>
		);
	}
}

// Create component for app header composed of input and button
const AppHead = ({ addTask}) => {

  let input;
 

  const [tempId, setTempId] = useState('test');

  const [marked, setMarked] = useState('test');

  const [isModalOpen, setIsModalOpen] = useState(false);

  const closeModal = () => {
    setIsModalOpen(!isModalOpen);
  };

  const openModal = () => {
    setIsModalOpen(true);
  };

  const testMethod = () => {
    console.log("Modal footer button was clicked");
  };

  const getMarked = () => {
    let text = "";

    var span = document.createElement("span");
  
    span.className = window.id++;

    if (window.getSelection) {
        text = window.getSelection().toString();
        var sel = window.getSelection();
        if (sel.rangeCount) {
            var range = sel.getRangeAt(0).cloneRange();
            range.surroundContents(span);
            sel.removeAllRanges();
            sel.addRange(range);
        }
  
    } else if (document.selection && document.selection.type !== "Control") {
        text = document.selection.createRange().text;
    }
    setMarked(text);
    setTempId(span.className);
    console.log('worked ' + text);
  };

 


    return (
      <div className="app-container">
        <div className="text-center">
        <div className="container-comment">
        <h3 >Comments</h3>
          <button onClick={() => {
          getMarked();
          openModal();
          }} className='input-group-addon' style={{ cursor: "pointer" }}>
            Add Comment
          </button>
          </div>
          <Modal
            modalClosed={closeModal}          
            show={isModalOpen}
            modalTitle="Provide a comment on the selected text"
            footerBtnCloseText="close"
            footerBtnCloseListener={testMethod}
            useModalHeader={true}
            useModalFooter={true}
          >
          <div className='input-group'>
          <input ref={node => {
            input = node;
          }} className='form-control' type='text' />
          
          <button onClick={() => {
            addTask(input.value,marked,tempId);
            input.value = '';
            console.log(tempId);
            setTempId('');
            closeModal();
          }} className='input-group-addon'>
            Add comment
          </button>
          </div>
          </Modal>
        </div>
      </div>
    );
};

// Create component for new task composed of list item, text and icon
const Task = ({task, remove}) => {
  // For each task create list item with specific text and icon to remove the task


  return (
    <li className='task-item'><div className={task.id} onClick={() => { $('.'+task.id).toggleClass("active")}}><div className="container-comment">{task.text} {task.markedText} <button className='input-group-addon' onClick={() => { $(task.id).removeClass("active")
    remove(task.id)  
    }}>Remove</button></div></div></li>
  );
}

// Create component for list of tasks
const AppList = ({tasks,remove}) => {
  // Create new node for each task
  const taskNode = tasks.map((task) => {
    return (<Task task={task} key={task.id} remove={remove}/>)
  });

  // Return the list component with all tasks
  return (<ul className='task-list'>{taskNode}</ul>);
}

// Create global variable for task id
window.id = 0;

// Create main task app component
class TaskApp extends React.Component {
  constructor(prop) {
    // Provide parent class with prop
    super(prop);

    // Set initial state as empty
    this.state = {
      data: []
    }
  }

  // Add task handler
  addTask(comm,mComm,id) {
    // Get the data for tasks such as text and id
    const task = {
      text: comm,
      id: id,
      markedText: mComm
    }
    
    // Update data if input contains some text
    if (comm.length > 0) this.state.data.push(task);
    
    // Update state with newest data - append new task
    this.setState({
      data: this.state.data
    });
  }
  
  // Handle remove
  removeTask(id) {
    // Filter all tasks except the one to be removed
    const taskCollection = this.state.data.filter((task) => {
      if (task.id !== id) return task;
    });

 

    // Update state with filtered results
    this.setState({
      data: taskCollection
    });
  }

  render() {
    // Render whole App component
    // use AppHead and AppList components
    return (
      <div>
        <AppHead addTask={this.addTask.bind(this)}/>


        <AppList 
          tasks={this.state.data}
          remove={this.removeTask.bind(this)}
        />
      </div>
    );
  }
}

// Finally, render the whole app
//ReactDOM.render(<TaskApp />, appContainer);

export default TaskApp;