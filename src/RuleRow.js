import React, { Component } from 'react';
import './RuleRow.css'

class RuleRow extends Component {
  constructor(props){
    super(props);
    this.state = {clicked : false}
    this.handleClick = this.handleClick.bind(this);
  }
  handleClick()
  {
    // this.props.doScore();
    this.setState({
      clicked : true
    })
    this.state.clicked ? null : this.props.doScore()
  }
  render() {
    
    return (
      <tr className={this.state.clicked ? "RuleRow RuleRow-disabled" : "RuleRow RuleRow-active"} onClick={this.handleClick}>
        <td className="RuleRow-name">{this.props.name}</td>
        <td className="RuleRow-score">{this.state.clicked ? this.props.score : this.props.description}</td>
      </tr>
    )
  }
}

export default RuleRow;