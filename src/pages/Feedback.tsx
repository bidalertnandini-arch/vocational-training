import { useState } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { studentFeedback, faculty, getFacultyById } from '@/data/mockData';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import {
    MessageSquare,
    Search,
    Star,
    ThumbsUp,
    ThumbsDown,
    Minus,
    Filter
} from 'lucide-react';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';

const Feedback = () => {
    const { t, isTeluguActive } = useLanguage();
    const [searchQuery, setSearchQuery] = useState('');
    const [sentimentFilter, setSentimentFilter] = useState('all');

    // Enrich feedback with faculty names
    const enrichedFeedback = studentFeedback.map(fb => {
        const fac = getFacultyById(fb.facultyId);
        return {
            ...fb,
            facultyName: fac?.name || 'Unknown Faculty',
            facultyNameTE: fac?.nameTE || 'తెలియని ఫ్యాకల్టీ',
            trade: fac?.trade || 'Unknown Trade'
        };
    });

    // Filter Logic
    const filteredFeedback = enrichedFeedback.filter(fb => {
        const matchesSearch =
            fb.facultyName.toLowerCase().includes(searchQuery.toLowerCase()) ||
            fb.feedbackText.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesSentiment = sentimentFilter === 'all' || fb.sentiment === sentimentFilter;
        return matchesSearch && matchesSentiment;
    });

    // Stats Calculation
    const totalFeedback = enrichedFeedback.length;
    const avgRating = (enrichedFeedback.reduce((sum, fb) => sum + fb.rating, 0) / totalFeedback) || 0;
    const positiveCount = enrichedFeedback.filter(f => f.sentiment === 'positive').length;
    const sentimentScore = Math.round((positiveCount / totalFeedback) * 100) || 0;

    const RatingStars = ({ rating }: { rating: number }) => (
        <div className="flex gap-0.5">
            {[1, 2, 3, 4, 5].map((star) => (
                <Star
                    key={star}
                    className={`h-4 w-4 ${star <= rating ? 'fill-yellow-400 text-yellow-400' : 'text-slate-200'}`}
                />
            ))}
        </div>
    );

    return (
        <div className="space-y-6 animate-fade-in">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-foreground flex items-center gap-2">
                        <MessageSquare className="h-8 w-8 text-primary" />
                        Student Feedback
                    </h1>
                    <p className="text-muted-foreground">
                        Review and analyze student feedback for continuous improvement.
                    </p>
                </div>
                {/* Search & Filter */}
                <div className="flex gap-2 w-full sm:w-auto">
                    <div className="relative w-full sm:w-[250px]">
                        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                            placeholder="Search faculty or keywords..."
                            className="pl-9"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                </div>
            </div>

            {/* Stats Overview */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card className="bg-primary/5 border-primary/20">
                    <CardContent className="p-6 flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-muted-foreground">Total Responses</p>
                            <h2 className="text-4xl font-bold text-primary">{totalFeedback}</h2>
                        </div>
                        <MessageSquare className="h-10 w-10 text-primary/40" />
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="p-6 flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-muted-foreground">Average Rating</p>
                            <div className="flex items-baseline gap-2">
                                <h2 className="text-4xl font-bold text-yellow-600">{avgRating.toFixed(1)}</h2>
                                <span className="text-sm text-yellow-600/80">/ 5.0</span>
                            </div>
                        </div>
                        <Star className="h-10 w-10 text-yellow-400 fill-yellow-400" />
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="p-6 flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-muted-foreground">Positive Sentiment</p>
                            <h2 className="text-4xl font-bold text-green-600">{sentimentScore}%</h2>
                        </div>
                        <div className="h-12 w-12 rounded-full border-[3px] border-green-100 flex items-center justify-center">
                            <ThumbsUp className="h-6 w-6 text-green-600" />
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Main Content Area */}
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">

                {/* Left Sidebar: Filters & Distribution */}
                <div className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-sm font-medium">Sentiment Filter</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-2">
                            <button
                                onClick={() => setSentimentFilter('all')}
                                className={`w-full text-left px-3 py-2 rounded-md text-sm transition-colors flex items-center justify-between ${sentimentFilter === 'all' ? 'bg-primary text-primary-foreground' : 'hover:bg-muted'}`}
                            >
                                <span>All Feedback</span>
                                <span className="bg-background/20 px-1.5 rounded text-xs">{enrichedFeedback.length}</span>
                            </button>
                            <button
                                onClick={() => setSentimentFilter('positive')}
                                className={`w-full text-left px-3 py-2 rounded-md text-sm transition-colors flex items-center justify-between ${sentimentFilter === 'positive' ? 'bg-green-100 text-green-800' : 'hover:bg-muted'}`}
                            >
                                <span className="flex items-center gap-2"><ThumbsUp className="h-3 w-3" /> Positive</span>
                                <span className="bg-background/50 px-1.5 rounded text-xs">
                                    {enrichedFeedback.filter(f => f.sentiment === 'positive').length}
                                </span>
                            </button>
                            <button
                                onClick={() => setSentimentFilter('neutral')}
                                className={`w-full text-left px-3 py-2 rounded-md text-sm transition-colors flex items-center justify-between ${sentimentFilter === 'neutral' ? 'bg-yellow-100 text-yellow-800' : 'hover:bg-muted'}`}
                            >
                                <span className="flex items-center gap-2"><Minus className="h-3 w-3" /> Neutral</span>
                                <span className="bg-background/50 px-1.5 rounded text-xs">
                                    {enrichedFeedback.filter(f => f.sentiment === 'neutral').length}
                                </span>
                            </button>
                            <button
                                onClick={() => setSentimentFilter('negative')}
                                className={`w-full text-left px-3 py-2 rounded-md text-sm transition-colors flex items-center justify-between ${sentimentFilter === 'negative' ? 'bg-red-100 text-red-800' : 'hover:bg-muted'}`}
                            >
                                <span className="flex items-center gap-2"><ThumbsDown className="h-3 w-3" /> Negative</span>
                                <span className="bg-background/50 px-1.5 rounded text-xs">
                                    {enrichedFeedback.filter(f => f.sentiment === 'negative').length}
                                </span>
                            </button>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle className="text-sm font-medium">Rating Distribution</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {[5, 4, 3, 2, 1].map(score => {
                                const count = enrichedFeedback.filter(f => Math.round(f.rating) === score).length;
                                const percent = (count / totalFeedback) * 100;
                                return (
                                    <div key={score} className="space-y-1">
                                        <div className="flex items-center justify-between text-xs text-muted-foreground">
                                            <div className="flex items-center gap-1">
                                                {score} <Star className="h-3 w-3 fill-slate-300 text-slate-300" />
                                            </div>
                                            <span>{count}</span>
                                        </div>
                                        <Progress value={percent} className="h-1.5" />
                                    </div>
                                );
                            })}
                        </CardContent>
                    </Card>
                </div>

                {/* Right Area: Feedback List */}
                <div className="lg:col-span-3 space-y-4">
                    {filteredFeedback.length > 0 ? (
                        filteredFeedback.map((fb) => (
                            <Card key={fb.id} className="hover:shadow-md transition-shadow">
                                <CardContent className="p-5">
                                    <div className="flex flex-col sm:flex-row gap-4 justify-between items-start">
                                        <div className="space-y-2 flex-1">
                                            <div className="flex items-center gap-2">
                                                <RatingStars rating={fb.rating} />
                                                <span className="text-sm font-semibold">{fb.rating.toFixed(1)}</span>
                                                <Badge variant="outline" className={`ml-2 capitalize ${fb.sentiment === 'positive' ? 'bg-green-50 text-green-700 border-green-200' :
                                                        fb.sentiment === 'negative' ? 'bg-red-50 text-red-700 border-red-200' :
                                                            'bg-yellow-50 text-yellow-700 border-yellow-200'
                                                    }`}>
                                                    {fb.sentiment}
                                                </Badge>
                                            </div>

                                            <p className="text-lg text-foreground">
                                                "{isTeluguActive ? fb.feedbackTextTE : fb.feedbackText}"
                                            </p>

                                            <div className="flex items-center gap-2 text-sm text-muted-foreground pt-1">
                                                <span>To: <span className="font-medium text-foreground">{isTeluguActive ? fb.facultyNameTE : fb.facultyName}</span></span>
                                                <span>•</span>
                                                <span>{fb.trade}</span>
                                                <span>•</span>
                                                <span>{fb.date}</span>
                                            </div>
                                        </div>

                                        {fb.isAnonymous && (
                                            <Badge variant="secondary" className="bg-slate-100 text-slate-500">Anonymous</Badge>
                                        )}
                                    </div>
                                </CardContent>
                            </Card>
                        ))
                    ) : (
                        <div className="flex flex-col items-center justify-center py-12 text-center bg-muted/20 rounded-lg border border-dashed">
                            <Search className="h-10 w-10 text-muted-foreground mb-3" />
                            <h3 className="text-lg font-semibold">No feedback found</h3>
                            <p className="text-muted-foreground">Try adjusting your search or filters.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Feedback;
