import React, { Component } from 'react';
import axios from 'axios';

class Leaderboard extends Component {
	state = {
		leaderboard: []
	}

	componentDidMount() {
		axios.get('http://localhost:3000/api/users/leaderboard')
			.then(res => {

				if(res.data.success){
					this.setState({
						leaderboard: res.data.leaderboard
					})
				}
			});
	}

	render() {
		const { leaderboard } = this.state;

		return (
			<div className="container">
				<div className="row">
					<h1>Leaderboard</h1>
					{ leaderboard.length > 0 ? (
						<table className="table table-striped table-bordered">
							<thead>
								<tr>
									<th>#</th>
									<th>Username</th>
									<th>Points</th>
								</tr>
							</thead>
							<tbody>
								{ leaderboard.map((user, idx) => (
									<tr key={idx}>
										<td>{ idx + 1 }</td>
										<td>{ user.username }</td>
										<td>{ user.points }</td>
									</tr>
								)) }
							</tbody>
						</table>
					) : 'No users registered in the leaderboard.' }
				</div>
			</div>
		);
	}
}

export default Leaderboard;
