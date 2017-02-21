import React, { Component } from 'react'
import Dropzone from 'react-dropzone'
import sha1 from 'sha1'
import { APIManager } from '../../utils'

class CreatePost extends Component {

	constructor(){
		super()
		this.state = {
			post: {
				image: '',
				caption: ''
			}
		}
	}

	updatePost(event){
		event.preventDefault()
		let updated = Object.assign({}, this.state.post)
		updated[event.target.id] = event.target.value
		this.setState({
			post: updated
		})
	}

	submitPost(event){
		event.preventDefault()

		if (this.state.post.image.length == 0) {
			alert('Please add an image first.')
			return
		}

		if (this.state.post.caption.length == 0) {
			alert('Please add a caption.')
			return
		}

		let updated = Object.assign({}, this.state.post)
		this.props.onCreate(updated)
	}

	imageSelected(files){

		const image = files[0]

		const cloudName = 'hgbq4zus3'
		const url = 'https://api.cloudinary.com/v1_1/'+cloudName+'/image/upload'

		let timestamp = Date.now() / 1000
		const uploadPreset = 'jlalatq3'

		const paramsStr = 'timestamp='+timestamp+'&upload_preset='+uploadPreset+'VMuBWar-JGZgmZAo5nny04sPfoo'
		const signature = sha1(paramsStr)

		const params = {
			'api_key': '426482689397818',
			'timestamp': timestamp,
			'upload_preset': uploadPreset,
			'signature': signature
		}

		APIManager.uploadFile(url, image, params)
		.then((uploaded) => {
			let updated = Object.assign({}, this.state.post)
			updated['image'] = uploaded['secure_url']
			this.setState({
				post: updated
			})
		})
		.catch((err) =>{
			alert(err)
		})

	}
	
	render(){
		return (
			<div style={{background:'#fff'}}>
				<h2>Submit Post</h2>
				<input id="caption" onChange={this.updatePost.bind(this)} type="text" placeholder="Caption" />
				<div className="row">
					<div className="3u 12u$(small)">
						<Dropzone onDrop={this.imageSelected.bind(this)} style={{border:'none', marginTop:12}}>
							<button className="button special small">Add Image</button>
						</Dropzone>					
					</div>
					<div className="3u 12u$(small)">
						<button className="button special small" style={{marginTop:12, marginLeft:12, width:90+'%'}} onClick={this.submitPost.bind(this)}>Submit</button>
					</div>
					<div className="6u 12u$(small)">
						<img style={{width:120, float:'right', marginTop:12}} src={this.state.post.image} />
					</div>
				</div>

				<br /><br /><hr />
			</div>
		)
	}
}

export default CreatePost