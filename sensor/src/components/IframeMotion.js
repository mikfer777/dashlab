import React, {Component} from 'react';


class IframeMotion extends Component {


    iframe:

    function() {
        return {
            __html: this.props.iframe
        }
    }

,

    render:

    function() {
        return (
            <div>
                <div dangerouslySetInnerHTML={this.iframe()}/>
            </div>
        );
    }

    const iframe = '<iframe src="http://192.168.1.34:8081" width="540" height="450"></iframe>';

}