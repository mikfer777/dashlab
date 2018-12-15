from channels.consumer import SyncConsumer

from asgiref.sync import async_to_sync


class TestWorker(SyncConsumer):
    def triggerWorker(self, message):
        async_to_sync(self.channel_layer.group_add)("sensor_room", self.channel_name)
        async_to_sync(self.channel_layer.group_send)(
            "sensor_room",
            {
                'type': "sensor_message",
                'msg': "sent from worker",
            })



    #handler definition by type of message
    def sensor_message(self, message):
        print("Message to worker sensor_message ", message)
        #self.triggerWorker(message)

class TestWorker2(SyncConsumer):
    def triggerWorker(self, message):
        async_to_sync(self.channel_layer.group_add)("testGroup", self.channel_name)
        async_to_sync(self.channel_layer.group_send)(
            "testGroup",
            {
                'type': "echo_msg",
                'msg': "sent from worker",
            })

    def echo_msg(self, message):
        print("Message to worker ", message)
