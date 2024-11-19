import mongoose, { Schema, Document } from 'mongoose';

export interface IMedia extends Document {
  title: string;
  type: string;
  path: string;
}

const MediaSchema: Schema = new Schema({
  title: { type: String, required: true },
  type: { type: String, enum: ['audio', 'video'], required: true },
  path: { type: String, required: true }
});

export default mongoose.model<IMedia>('Media', MediaSchema);

/*
import Media from './path-to-your-model';

// Creating a Media Document:
const newMedia = new Media({
  title: 'My Favorite Song',
  type: 'audio',
  path: '/media/audio/my-favorite-song.mp3',
});

newMedia.save()
  .then(() => console.log('Media saved successfully!'))
  .catch(err => console.error('Error saving media:', err));


// Querying Media:
Media.find({ type: 'audio' })
  .then(results => console.log('Audio Media:', results))
  .catch(err => console.error('Error fetching media:', err));
*/
