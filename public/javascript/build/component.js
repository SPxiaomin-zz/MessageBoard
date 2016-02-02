var React = require('react');
var ReactDOM = require('react-dom');
var ReactCSSTransitionGroup = require('react-addons-css-transition-group');
var $ = require('../lib/jquery.min.js');


var Comment = React.createClass({
    render: function() {
        return (
            <div className='comment'>
                <div className='comment-body'>
                    {this.props.children}
                </div>
                <p className='commen-origin'>
                    <span className='comment-name'>{this.props.author}</span> posted at {this.props.dtime}
                </p>
            </div>
        );
    }
});

var CommentList = React.createClass({
    render: function() {
        var commentNodes = this.props.data.map(function(comment) {
            return (
                <Comment key={comment._id} author={comment.author} dtime={comment.dtime}>
                    {comment.msg}
                </Comment>
            );
        });
        return (
            <div className='comment-list'>
                <ReactCSSTransitionGroup transitionName='comment' transitionEnterTimeout={500} transitionLeave={false}>
                    {commentNodes}
                </ReactCSSTransitionGroup>
            </div>
        );
    }
});

var CommentForm = React.createClass({
    author: localStorage.getItem('author'),
    handleSubmit: function(event) {
        event.preventDefault();

        var author = this.ref.author.value.trim();
        var msg = this.ref.msg.value.trim();
        if ( !author || !msg ) {
            return ;
        }

        localStorage.setItem('author', author);
        this.props.onCommentSubmit({author: author, msg: msg});
        this.ref.author.value = '';
        this.ref.msg.value = '';

        return;
    },
    render: function() {
        return (
            <div className='comment-form' onSubmit={this.handleSubmit}>
                <form>
                    <p>
                        <input type='text' placeholder='Your name...' ref='author' defaultValue={this.author} />
                    </p>
                    <p>
                        <textarea placeholder='Say something...' ref='msg'></textarea>
                    </p>
                    <p>
                        <input type='submit' value='submit' />
                    </p>
                </form>
            </div>
        );
    }
});

var CommentBox = React.createClass({
    render: function() {
        return (
            <div className='comment-box'>
                <CommentForm onCommentSubmit={this.handleCommentSubmit} />
                <div className={this.state.addLoading}><p></p></div>
                <CommentList data={this.state.data} />
                <div className={this.state.moreLoading}><p></p></div>
                <p className={this.state.noMore}>已经到底啦啦啦～</p>
            </div>
        );
    }
});

ReactDOM.render({
    <CommentBox />,
    document.getElementById('commentWrap')
});
