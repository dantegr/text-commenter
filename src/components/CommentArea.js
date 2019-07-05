import React, { useState } from 'react';
import { PureComponent,  createRef } from 'react';
import FontAwesome from 'react-fontawesome';

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
const AppHead = ({addTask}) => {

  let input;

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

  
    return (
      <div className="app-container">
        <div className="text-center">
        <h3>Comments</h3>
          <button onClick={openModal} style={{ cursor: "pointer" }}>
            Add Comment
          </button>
          {/*Modal properties
          - modalClosed => a method to close the modal
          - show => boolean value to determine whether to show or hide the modal        
          - modalTitle => modal header text (default empty)
          - footerBtnText => the text of the footer button (default "close")         
          - footerBtnListener => a method for the footer button (Note: the footer button will trigger this method as well as the modalClosed method)
          - useModalHeader => boolean value which determines whether to use the modal header or not (default true) 
          - useModalFooter => boolean value which determines whether to use the modal footer or not (default true)  */}
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
            addTask(input.value);
            input.value = '';
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
    <li className='task-item'>{task.text} <span className='fa fa-trash-o task-remover pull-right' onClick={() => {remove(task.id)}}>Remove</span></li>
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
  addTask(val) {
    // Get the data for tasks such as text and id
    const task = {
      text: val,
      id: window.id++
    }
    
    // Update data if input contains some text
    if (val.length > 0) this.state.data.push(task);
    
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