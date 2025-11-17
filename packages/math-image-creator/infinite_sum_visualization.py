from manim import *

class InfiniteSumVisualization(Scene):
    def construct(self):
        # Title
        title = Text("Visualizing Infinite Sums", font_size=36)
        title.to_edge(UP, buff=0.5)
        self.play(Write(title))
        self.wait(1)
        
        # Introduction text
        intro_text = Text(
            "Additional distance Achilles needs to cover\nafter the initial head start is closed", 
            font_size=24
        )
        intro_text.next_to(title, DOWN, buff=0.5)
        self.play(Write(intro_text))
        self.wait(2)
        
        # Create the main line segment (representing 1 unit)
        main_line = Line(LEFT*4, RIGHT*4)
        main_line.set_stroke(BLUE, width=8)
        main_line.move_to(ORIGIN + DOWN*0.5)
        
        # Label the total distance as 1 unit
        unit_label = Text("1 unit", font_size=20)
        unit_label.next_to(main_line, UP, buff=0.3)
        
        self.play(FadeOut(intro_text))
        self.play(Create(main_line), Write(unit_label))
        self.wait(1)
        
        # Create segments for the infinite sum visualization
        segments = VGroup()
        segment_labels = VGroup()
        step_texts = VGroup()
        
        # Starting position and total length
        start_pos = main_line.get_start()
        total_length = main_line.get_length()
        
        # Create segments for 1/2, 1/4, 1/8, 1/16, 1/32
        fractions = [1/2, 1/4, 1/8, 1/16, 1/32]
        colors = [YELLOW, GREEN, RED, ORANGE, PINK]
        
        current_pos = start_pos
        
        for i, (fraction, color) in enumerate(zip(fractions, colors)):
            # Calculate segment length
            segment_length = total_length * fraction
            
            # Create segment
            segment = Line(
                current_pos, 
                current_pos + RIGHT * segment_length
            )
            segment.set_stroke(color, width=8)
            segments.add(segment)
            
            # Create fraction label
            if fraction == 1/2:
                frac_text = "1/2"
            elif fraction == 1/4:
                frac_text = "1/4"
            elif fraction == 1/8:
                frac_text = "1/8"
            elif fraction == 1/16:
                frac_text = "1/16"
            else:
                frac_text = "1/32"
                
            label = Text(frac_text, font_size=18, color=color)
            # Special positioning for 1/32 to avoid overlap with 1/16
            if fraction == 1/32:
                label.next_to(segment, UP, buff=0.1)
                # Shift it slightly to the right to avoid overlap
                label.shift(RIGHT*0.3)
            else:
                label.next_to(segment, UP, buff=0.1)
            segment_labels.add(label)
            
            # Create step explanation text
            if i == 0:
                step_text = Text("First, Achilles covers 1/2 of the remaining distance.", font_size=20)
            elif i == 1:
                step_text = Text("Then, 1/4.", font_size=20)
            elif i == 2:
                step_text = Text("Then, 1/8.", font_size=20)
            elif i == 3:
                step_text = Text("Then, 1/16.", font_size=20)
            else:
                step_text = Text("Then, 1/32.", font_size=20)
            
            step_text.to_edge(DOWN, buff=1)
            step_texts.add(step_text)
            
            current_pos = segment.get_end()
        
        # Animate each segment appearing with explanation
        for i, (segment, label, step_text) in enumerate(zip(segments, segment_labels, step_texts)):
            # Show step explanation
            self.play(Write(step_text))
            self.wait(0.5)
            
            # Highlight the segment
            self.play(
                Create(segment),
                Write(label),
                run_time=1.5
            )
            self.wait(1)
            
            # Remove step text (except keep the last one for transition)
            if i < len(step_texts) - 1:
                self.play(FadeOut(step_text))
        
        # Add dots to show continuation
        dots = Text("...", font_size=20)
        dots.next_to(segments[-1], RIGHT, buff=0.1)
        dots.shift(UP*0.1)
        self.play(Write(dots))
        
        # Show the sum building up
        self.play(FadeOut(step_texts[-1]))
        
        sum_title = Text("Sum building up:", font_size=24)
        sum_title.to_edge(DOWN, buff=2)
        self.play(Write(sum_title))
        
        # Mathematical sum expression
        sum_expr = MathTex(
            r"\frac{1}{2}", r"+", r"\frac{1}{4}", r"+", r"\frac{1}{8}", 
            r"+", r"\frac{1}{16}", r"+", r"\frac{1}{32}", r"+ \cdots"
        )
        sum_expr.next_to(sum_title, DOWN, buff=0.3)
        
        # Animate the sum expression building up
        for i in range(0, len(sum_expr), 2):  # Skip the plus signs initially
            if i < len(sum_expr):
                self.play(Write(sum_expr[i]), run_time=0.5)
                if i + 1 < len(sum_expr):
                    self.play(Write(sum_expr[i + 1]), run_time=0.3)
        
        self.wait(1)
        
        # Show that the sum approaches 1
        approaching_text = Text(
            "This sum visually approaches the full length\nof the original segment", 
            font_size=20
        )
        approaching_text.next_to(sum_expr, DOWN, buff=0.5)
        self.play(Write(approaching_text))
        self.wait(2)
        
        # Highlight how the segments fill up the original line
        filled_segments = VGroup(*segments)
        self.play(
            filled_segments.animate.set_stroke(width=12),
            run_time=2
        )
        self.wait(1)
        
        # Final paradox text
        self.play(FadeOut(approaching_text))
        paradox_text = Text(
            "This is an infinite series of ever-smaller distances.\nAn infinite number of steps... how can Achilles ever finish?", 
            font_size=22,
            color=RED
        )
        paradox_text.next_to(sum_expr, DOWN, buff=0.5)
        self.play(Write(paradox_text))
        self.wait(3)
        
        # Final equation showing the sum equals 1
        final_equation = MathTex(
            r"\sum_{n=1}^{\infty} \frac{1}{2^n} = 1"
        )
        final_equation.next_to(paradox_text, DOWN, buff=0.5)
        self.play(Write(final_equation))
        self.wait(3)