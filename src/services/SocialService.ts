export interface User {
  id: string;
  name: string;
  avatar: string;
  role: 'student' | 'teacher' | 'admin';
  level: 'beginner' | 'intermediate' | 'advanced' | 'expert';
  joinDate: Date;
  bio?: string;
  specialties: string[];
}

export interface Post {
  id: string;
  authorId: string;
  author: User;
  content: string;
  type: 'choreography' | 'achievement' | 'question' | 'tip' | 'video';
  attachments?: {
    type: 'image' | 'video' | 'choreography';
    url: string;
    thumbnail?: string;
  }[];
  likes: number;
  comments: Comment[];
  shares: number;
  createdAt: Date;
  tags: string[];
  visibility: 'public' | 'followers' | 'private';
}

export interface Comment {
  id: string;
  authorId: string;
  author: User;
  content: string;
  createdAt: Date;
  likes: number;
  replies: Comment[];
}

export interface Follow {
  followerId: string;
  followingId: string;
  createdAt: Date;
}

export interface Like {
  userId: string;
  postId: string;
  createdAt: Date;
}

export interface Share {
  userId: string;
  postId: string;
  createdAt: Date;
  platform: 'internal' | 'facebook' | 'twitter' | 'instagram';
}

class SocialService {
  private users: User[] = [];
  private posts: Post[] = [];
  private follows: Follow[] = [];
  private likes: Like[] = [];
  private shares: Share[] = [];
  private currentUser: User | null = null;

  constructor() {
    this.initializeUsers();
    this.generateRealPosts();
  }

  // Initialize real users for Heliopsis Dance Academy
  private initializeUsers(): void {
    this.users = [
      {
        id: 'user-1',
        name: 'Liesbeth Kreps',
        avatar: 'https://heliopsis.be/avatars/liesbeth.jpg',
        role: 'teacher',
        level: 'expert',
        joinDate: new Date('2010-01-01'),
        bio: 'Board member, dance teacher, responsible for dance-artistic leadership, administration and operational team.',
        specialties: ['Contemporary', 'Modern', 'Jazz', 'Leadership']
      },
      {
        id: 'user-2',
        name: 'Giulia',
        avatar: 'https://heliopsis.be/avatars/giulia.jpg',
        role: 'teacher',
        level: 'expert',
        joinDate: new Date('2012-03-01'),
        bio: 'Board member, dance teacher, operational team member, responsible for social media & dance-artistic leadership.',
        specialties: ['Contemporary', 'Modern', 'Social Media', 'Leadership']
      },
      {
        id: 'user-3',
        name: 'Miet',
        avatar: 'https://heliopsis.be/avatars/miet.jpg',
        role: 'teacher',
        level: 'expert',
        joinDate: new Date('2014-09-01'),
        bio: 'Dance teacher and operational team member. Specialized in contemporary and modern dance techniques.',
        specialties: ['Contemporary', 'Modern', 'Creative Movement']
      },
      {
        id: 'user-4',
        name: 'Erien',
        avatar: 'https://heliopsis.be/avatars/erien.jpg',
        role: 'teacher',
        level: 'expert',
        joinDate: new Date('2017-03-01'),
        bio: 'Dance teacher focused on hip hop and urban dance styles. Passionate about working with young dancers.',
        specialties: ['Hip Hop', 'Urban', 'Breakdance', 'Youth']
      }
    ];

    // Set current user
    this.currentUser = this.users[0];
  }

  // Generate real posts for Heliopsis Dance Academy
  private generateRealPosts(): void {
    this.posts = [
      {
        id: 'post-1',
        authorId: 'user-1',
        author: this.users[0],
        content: 'Great contemporary dance class today! The students showed amazing progress in their technique and expression.',
        type: 'choreography',
        attachments: [{
          type: 'image',
          url: 'https://heliopsis.be/posts/contemporary-class-1.jpg',
          thumbnail: 'https://heliopsis.be/posts/contemporary-class-1-thumb.jpg'
        }],
        likes: 24,
        comments: [],
        shares: 3,
        createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
        tags: ['Contemporary', 'Dance Class', 'Progress'],
        visibility: 'public'
      },
      {
        id: 'post-2',
        authorId: 'user-2',
        author: this.users[1],
        content: 'Hip Hop workshop this weekend! Don\'t miss the opportunity to learn from our amazing urban dance specialists.',
        type: 'video',
        attachments: [{
          type: 'video',
          url: 'https://heliopsis.be/posts/hip-hop-workshop.mp4',
          thumbnail: 'https://heliopsis.be/posts/hip-hop-workshop-thumb.jpg'
        }],
        likes: 31,
        comments: [],
        shares: 7,
        createdAt: new Date(Date.now() - 6 * 60 * 60 * 1000), // 6 hours ago
        tags: ['Hip Hop', 'Workshop', 'Urban Dance'],
        visibility: 'public'
      },
      {
        id: 'post-3',
        authorId: 'user-3',
        author: this.users[2],
        content: 'Ballet technique class focusing on proper alignment and graceful movements. The foundation of all dance styles!',
        type: 'choreography',
        attachments: [{
          type: 'image',
          url: 'https://heliopsis.be/posts/ballet-technique.jpg',
          thumbnail: 'https://heliopsis.be/posts/ballet-technique-thumb.jpg'
        }],
        likes: 18,
        comments: [],
        shares: 2,
        createdAt: new Date(Date.now() - 12 * 60 * 60 * 1000), // 12 hours ago
        tags: ['Ballet', 'Technique', 'Foundation'],
        visibility: 'public'
      }
    ];
  }

  // Obtener feed de posts
  getFeed(limit: number = 10, offset: number = 0): Post[] {
    return this.posts
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
      .slice(offset, offset + limit);
  }

  // Obtener posts de un usuario
  getUserPosts(userId: string, limit: number = 10): Post[] {
    return this.posts
      .filter(post => post.authorId === userId)
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
      .slice(0, limit);
  }

  // Crear nuevo post
  createPost(content: string, type: Post['type'], attachments?: Post['attachments'], tags: string[] = [], visibility: Post['visibility'] = 'public'): Post {
    if (!this.currentUser) {
      throw new Error('Usuario no autenticado');
    }

    const newPost: Post = {
      id: `post-${Date.now()}`,
      authorId: this.currentUser.id,
      author: this.currentUser,
      content,
      type,
      attachments,
      likes: 0,
      comments: [],
      shares: 0,
      createdAt: new Date(),
      tags,
      visibility
    };

    this.posts.unshift(newPost);
    return newPost;
  }

  // Dar like a un post
  likePost(postId: string): boolean {
    if (!this.currentUser) return false;

    const existingLike = this.likes.find(
      like => like.userId === this.currentUser!.id && like.postId === postId
    );

    if (existingLike) {
      // Quitar like
      this.likes = this.likes.filter(like => like !== existingLike);
      const post = this.posts.find(p => p.id === postId);
      if (post) post.likes--;
      return false;
    } else {
      // Agregar like
      this.likes.push({
        userId: this.currentUser.id,
        postId,
        createdAt: new Date()
      });
      const post = this.posts.find(p => p.id === postId);
      if (post) post.likes++;
      return true;
    }
  }

  // Comentar en un post
  addComment(postId: string, content: string): Comment | null {
    if (!this.currentUser) return null;

    const post = this.posts.find(p => p.id === postId);
    if (!post) return null;

    const newComment: Comment = {
      id: `comment-${Date.now()}`,
      authorId: this.currentUser.id,
      author: this.currentUser,
      content,
      createdAt: new Date(),
      likes: 0,
      replies: []
    };

    post.comments.push(newComment);
    return newComment;
  }

  // Compartir post
  sharePost(postId: string, platform: Share['platform'] = 'internal'): boolean {
    if (!this.currentUser) return false;

    const post = this.posts.find(p => p.id === postId);
    if (!post) return false;

    this.shares.push({
      userId: this.currentUser.id,
      postId,
      createdAt: new Date(),
      platform
    });

    post.shares++;
    return true;
  }

  // Seguir usuario
  followUser(userId: string): boolean {
    if (!this.currentUser || this.currentUser.id === userId) return false;

    const existingFollow = this.follows.find(
      follow => follow.followerId === this.currentUser!.id && follow.followingId === userId
    );

    if (existingFollow) {
      // Dejar de seguir
      this.follows = this.follows.filter(follow => follow !== existingFollow);
      return false;
    } else {
      // Seguir
      this.follows.push({
        followerId: this.currentUser.id,
        followingId: userId,
        createdAt: new Date()
      });
      return true;
    }
  }

  // Obtener seguidores de un usuario
  getFollowers(userId: string): User[] {
    const followerIds = this.follows
      .filter(follow => follow.followingId === userId)
      .map(follow => follow.followerId);
    
    return this.users.filter(user => followerIds.includes(user.id));
  }

  // Obtener usuarios seguidos
  getFollowing(userId: string): User[] {
    const followingIds = this.follows
      .filter(follow => follow.followerId === userId)
      .map(follow => follow.followingId);
    
    return this.users.filter(user => followingIds.includes(user.id));
  }

  // Buscar usuarios
  searchUsers(query: string): User[] {
    const lowercaseQuery = query.toLowerCase();
    return this.users.filter(user => 
      user.name.toLowerCase().includes(lowercaseQuery) ||
      user.specialties.some(specialty => specialty.toLowerCase().includes(lowercaseQuery)) ||
      (user.bio && user.bio.toLowerCase().includes(lowercaseQuery))
    );
  }

  // Obtener posts por tag
  getPostsByTag(tag: string): Post[] {
    return this.posts.filter(post => 
      post.tags.some(postTag => postTag.toLowerCase().includes(tag.toLowerCase()))
    );
  }

  // Obtener tendencias
  getTrendingTags(): Array<{ tag: string; count: number }> {
    const tagCounts: { [key: string]: number } = {};
    
    this.posts.forEach(post => {
      post.tags.forEach(tag => {
        tagCounts[tag] = (tagCounts[tag] || 0) + 1;
      });
    });

    return Object.entries(tagCounts)
      .map(([tag, count]) => ({ tag, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);
  }

  // Obtener usuario actual
  getCurrentUser(): User | null {
    return this.currentUser;
  }

  // Obtener usuario por ID
  getUserById(userId: string): User | undefined {
    return this.users.find(user => user.id === userId);
  }

  // Obtener estadísticas de usuario
  getUserStats(userId: string): {
    postsCount: number;
    followersCount: number;
    followingCount: number;
    totalLikes: number;
    totalShares: number;
  } {
    const userPosts = this.posts.filter(post => post.authorId === userId);
    const followers = this.getFollowers(userId);
    const following = this.getFollowing(userId);
    
    const totalLikes = userPosts.reduce((sum, post) => sum + post.likes, 0);
    const totalShares = userPosts.reduce((sum, post) => sum + post.shares, 0);

    return {
      postsCount: userPosts.length,
      followersCount: followers.length,
      followingCount: following.length,
      totalLikes,
      totalShares
    };
  }

  // Obtener notificaciones
  getNotifications(): Array<{
    id: string;
    type: 'like' | 'comment' | 'follow' | 'share';
    message: string;
    userId: string;
    user: User;
    postId?: string;
    createdAt: Date;
    read: boolean;
  }> {
    // Simular notificaciones basadas en la actividad reciente
    const notifications: Array<{
      id: string;
      type: 'like' | 'comment' | 'follow' | 'share';
      message: string;
      userId: string;
      user: User;
      postId?: string;
      createdAt: Date;
      read: boolean;
    }> = [];
    
    // Notificaciones de likes
    this.likes.forEach(like => {
      if (like.userId !== this.currentUser?.id) {
        const post = this.posts.find(p => p.id === like.postId);
        if (post && post.authorId === this.currentUser?.id) {
          const user = this.getUserById(like.userId);
          if (user) {
            notifications.push({
              id: `notif-${like.userId}-${like.postId}`,
              type: 'like',
              message: `${user.name} le dio like a tu post`,
              userId: like.userId,
              user,
              postId: like.postId,
              createdAt: like.createdAt,
              read: false
            });
          }
        }
      }
    });

    return notifications.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }
}

// Instancia singleton
const socialService = new SocialService();
export default socialService;
