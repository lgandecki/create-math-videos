from manim import *

class NumberLineVisualization(Scene):
    def construct(self):
        # Display the title
        title = Text("The Number Line: Visualizing Numbers", font_size=48, color="#8B4513")
        title.to_edge(UP)
        self.play(Write(title))
        self.wait(1)
        
        # Create the horizontal line with arrows
        line = Line(LEFT * 6, RIGHT * 6, color=WHITE)
        left_arrow = Arrow(LEFT * 6.5, LEFT * 6, color=WHITE, stroke_width=3)
        right_arrow = Arrow(RIGHT * 6, RIGHT * 6.5, color=WHITE, stroke_width=3)
        
        # Animate the line appearing
        self.play(Create(line))
        self.play(Create(left_arrow), Create(right_arrow))
        self.wait(1)
        
        # Create tick marks and labels
        tick_marks = VGroup()
        labels = VGroup()
        
        # Add tick marks from -5 to 5
        for i in range(-5, 6):
            tick = Line(UP * 0.1, DOWN * 0.1, color=WHITE)
            tick.move_to(RIGHT * i)
            tick_marks.add(tick)
            
            # Create number labels
            if i == 0:
                label = Text("0", font_size=24, color=YELLOW)
            elif i > 0:
                label = Text(str(i), font_size=24, color=GREEN)
            else:
                label = Text(str(i), font_size=24, color=RED)
            
            label.next_to(tick, DOWN, buff=0.2)
            labels.add(label)
        
        # Animate tick marks and labels appearing
        self.play(Create(tick_marks))
        self.wait(0.5)
        
        # Start with 0 (origin)
        origin_label = labels[5]  # 0 is at index 5
        self.play(Write(origin_label))
        self.wait(1)
        
        # Highlight 0 as the origin
        origin_highlight = Circle(radius=0.3, color=YELLOW, stroke_width=3)
        origin_highlight.move_to(origin_label.get_center() + UP * 0.3)
        self.play(Create(origin_highlight))
        
        origin_text = Text("Origin", font_size=20, color=YELLOW)
        origin_text.next_to(origin_highlight, UP, buff=0.1)
        self.play(Write(origin_text))
        self.wait(1)
        
        # Add positive integers (right side)
        positive_labels = labels[6:]  # indices 6-10 for 1,2,3,4,5
        for i, label in enumerate(positive_labels):
            self.play(Write(label), run_time=0.3)
        self.wait(0.5)
        
        # Add positive infinity indication
        pos_infinity = Text("Positive Infinity →", font_size=20, color=GREEN)
        pos_infinity.next_to(RIGHT * 5, DOWN, buff=0.5)
        self.play(Write(pos_infinity))
        self.wait(1)
        
        # Add negative integers (left side)
        negative_labels = labels[:5]  # indices 0-4 for -5,-4,-3,-2,-1
        for i, label in enumerate(reversed(negative_labels)):
            self.play(Write(label), run_time=0.3)
        self.wait(0.5)
        
        # Add negative infinity indication
        neg_infinity = Text("← Negative Infinity", font_size=20, color=RED)
        neg_infinity.next_to(LEFT * 5, DOWN, buff=0.5)
        self.play(Write(neg_infinity))
        self.wait(2)
        
        # Final emphasis on the separation
        separator_line = Line(UP * 0.5, DOWN * 0.5, color=YELLOW, stroke_width=4)
        separator_line.move_to(ORIGIN)
        self.play(Create(separator_line))
        
        separation_text = Text("0 separates positive and negative numbers", 
                             font_size=24, color=YELLOW)
        separation_text.to_edge(DOWN)
        self.play(Write(separation_text))
        self.wait(3)