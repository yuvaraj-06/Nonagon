<Card>
    <CardBody>
        <Row>
            <Col className='text-left'>
                <form onSubmit={this.handleSubmit}>
                    <label>
                        <input type="file" name="file" onChange={this.onChangeHandler} />
                    </label>
                </form >
            </Col>
            <Col className='text-right'>
                <Button size='sm' type='submit'>Upload Video</Button>
                <Button size='sm' onClick={() => this.setState({ showInference: !this.state.showInference })}>{this.state.showInference === true ? 'Hide Inference' : 'Run Inference'}</Button>
            </Col>
        </Row>
        {
            this.state.showInference ?
                <div><br></br>
                    {/* <LiveFeed mlPort={'ws-runinference'} /> */}
                </div>
                :
                ''
        }
    </CardBody>
</Card>