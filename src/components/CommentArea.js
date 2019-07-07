import React, { useState, PureComponent, createRef } from 'react';
import $ from 'jquery';
import rangy from 'rangy';

//Modal Class
class Modal extends PureComponent {
	modalWrapper = createRef();

  //Header of the modal
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

  //Footer of the modal
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

  //Main modal render
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

// Create component for comment header 
const CommentHead = ({ addComment}) => {

  //State variables
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

  //Get marked text and wrap it to span tags with a unique id
  const getMarked = () => {
    let text = "";

    var span = document.createElement("span");
  
    span.className = window.id++;
    span.id = span.className;

    if (rangy.getSelection) {
      text = rangy.getSelection().toString();
      var sel = rangy.getSelection();
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

 

  //Use Modal component
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
            useModalHeader={true}
            useModalFooter={true}
          >
          <div className='input-group'>
          <input ref={node => {
            input = node;
          }} className='form-control' type='text' />
          
          <button onClick={() => {
            addComment(input.value,marked,tempId);
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

// Create component for new comment composed of list item
const Comment = ({comment, remove}) => {
  // For each comment create list item with specific text and remove the comment
  return (
    <li className='comment-item'><div className={comment.id} onClick={() => { $('.'+comment.id).toggleClass("active")}}><div className="container-comment">{comment.text} <button className='input-group-addon' onClick={() => { 
    remove(comment.id) }}>Remove</button></div></div></li>
  );
}

// Create component for list of comments
const CommentList = ({comments,remove}) => {
  const commentNode = comments.map((comment) => {
    return (<Comment comment={comment} key={comment.id} remove={remove}/>)
  });

  return (<ul className='comment-list'>{commentNode}</ul>);
}

//global variable for comment id also used for marked down text class
window.id = 0;

//CommentArea component
class CommentArea extends React.Component {
  constructor(prop) {
    super(prop);

    // Set initial state as empty
    this.state = {
      data: []
    }
  }

  // Add comment handler
  addComment(comm,mComm,id) {
    const comment = {
      text: comm,
      id: id,
      markedText: mComm
    }
    
    if (comm.length > 0) this.state.data.push(comment);

    this.setState({
      data: this.state.data
    });
  }
  
  //Remove comment handler and also unwrap span tags from the text area
  removeComment(id) {
    $("."+id).contents().unwrap();

    const commentCollection = this.state.data.filter((comment) => {
      if (comment.id !== id) return comment;
    });

    this.setState({
      data: commentCollection
    });
  }

  render() {
  
    // use CommentHead and CommentList components
    return (
      <div>
        <CommentHead addComment={this.addComment.bind(this)}/>


        <CommentList 
          comments={this.state.data}
          remove={this.removeComment.bind(this)}
        />
      </div>
    );
  }
}


export default CommentArea;