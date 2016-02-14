var React = require('react');
var ReactDOM = require('react-dom');
var ReactCSSTransitionGroup = require('react-addons-css-transition-group');
var $ = require('../lib/jquery.min.js');


var Comment = React.createClass({
    render: function() {
        return (
            <li className='board-main-item'>
                <p>{this.props.author}</p>
                <p>
                    {this.props.children}
                </p>
                <footer className='board-main-item-origin'>
                    <time>{this.props.dtime}</time>
                </footer>
            </li>
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
            <ul className='board-main-list'>
                <ReactCSSTransitionGroup transitionName='comment' transitionEnterTimeout={500} transitionLeave={false}>
                    {commentNodes}
                </ReactCSSTransitionGroup>
            </ul>
        );
    }
});

var CommentForm = React.createClass({
    author: localStorage.getItem('author'),
    handleSubmit: function(event) {
        event.preventDefault();

        var author = this.refs.author.value.trim();
        var msg = this.refs.msg.value.trim();
        if ( !author || !msg ) {
            return ;
        }

        localStorage.setItem('author', author);
        this.props.onCommentSubmit({author: author, msg: msg});
        this.refs.author.value = '';
        this.refs.msg.value = '';

        return;
    },
    render: function() {
        return (
            <div className='board-main-form' onSubmit={this.handleSubmit}>
                <form name='js_form'>
                    <fieldset>
                        <legend>comment here</legend>
                        <div>
                            <label htmlFor='name'>姓名</label>
                            <input type='text' id='name' name='js_name' placeholder='Your name...' required ref='author' defaultValue={this.author} />
                            <span id='js_name_form_hint' className='form-hint'>正确格式为：1~18个字符，可使用汉字、字母(已输入字符数: <span id='js_name_cnt'></span>)</span>
                        </div>
                        <div>
                            <label htmlFor='msg'>留言</label>
                            <textarea id='msg' name='js_msg' placeholder='Say something...' required ref='msg'></textarea>
                            <span id='js_msg_form_hint' className='form-hint'>正确格式为：1~240个字符(已输入字符数: <span id='js_msg_cnt'></span>)</span>
                        </div>
                        <div>
                            <input type='submit' value='submit' />
                        </div>
                    </fieldset>
                </form>
            </div>
        );
    }
});

var CommentBox = React.createClass({
    getInitialState: function() {
        return {
            data: [],
            noMore: 'no-more',
            addLoading: 'loading',
            moreLoading: 'loading'
        };
    },
    componentDidMount: function() {
        this.load();
        window.addEventListener('scroll', this.handleScroll);
    },
    page: 1,
    flag: true,
    load: function() {
        var that = this;
        $.ajax({
            url: '/list?page=1',
            type: 'get',
            dataType: 'json'
        })
        .done(function(data) {
            data && that.setState({data: data});
        })
        .fail(function(jqXHR, status, error) {
            console.error('/list?page=1', status, error.toString());
        });
    },
    loadMore: function() {
        var that = this;
        that.page ++;
        $.ajax({
            url: '/list?page=' + that.page,
            type: 'get',
            dataType: 'json',
            beforeSend: function() {
                that.setState({moreLoading: 'loading show'});
            }
        })
        .done(function(data) {
            if ( data && data.length > 0 ) {
                that.setState({
                    data: that.state.data.concat(data),
                    moreLoading: 'loading'
                });
            } else {
                that.setState({
                    moreLoading: 'loading',
                    noMore: 'no-more show'
                });
                that.flag = false;
            }
        })
        .fail(function(jqXHR, status, error) {
            console.error('/list?page=' + that.page, status, error.toString());
        });
    },
    handleScroll: function() {
        var top = $(window).scrollTop();
        var documentHeight = $(document).height();
        var windowHeight = $(window).height();

        this.flag && documentHeight - windowHeight - top < 30 && this.loadMore();
    },
    handleCommentSubmit: function(comment) {
        var that = this;
        $.ajax({
            url: '/save',
            type: 'post',
            dataType: 'json',
            data: comment,
            beforeSend: function() {
                that.setState({addLoading: 'loading show'});
            }
        })
        .done(function(data) {
            that.setState({
                addLoading: 'loading',
                data: data.ops.concat(that.state.data)
            });
        })
        .fail(function(jqXHR, status, error) {
            console.error('/save', status, error.toString());
        });
    },
    render: function() {
        return (
            <div className='comment-box'>
                <CommentForm onCommentSubmit={this.handleCommentSubmit} />
                <div className={this.state.addLoading}><p></p></div>
                <CommentList data={this.state.data} />
                <div className={this.state.moreLoading}><p></p></div>
                <p className={this.state.noMore}>已经到底啦～</p>
            </div>
        );
    }
});

ReactDOM.render(
    <CommentBox />,
    document.getElementById('js_board_main_container')
);
