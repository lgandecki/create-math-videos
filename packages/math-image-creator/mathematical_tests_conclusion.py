from manim import *

class MathematicalTestsConclusion(Scene):
    def construct(self):
        # Display the heading
        heading = Text("Why are Tests Useful?", font_size=48, color=BLUE)
        heading.to_edge(UP, buff=1)
        
        self.play(Write(heading))
        self.wait(1)
        
        # Summary points
        summary_points = [
            "They provide a systematic and verifiable way",
            "to classify objects, prove properties,",
            "or reach conclusions based on specific criteria."
        ]
        
        # Create summary text
        summary_text = Text("Summarize the importance of mathematical tests:", 
                          font_size=32, color=WHITE)
        summary_text.next_to(heading, DOWN, buff=1)
        
        self.play(Write(summary_text))
        self.wait(1)
        
        # Display summary points one by one
        point_group = VGroup()
        for i, point in enumerate(summary_points):
            point_text = Text(point, font_size=28, color=GREEN)
            if i == 0:
                point_text.next_to(summary_text, DOWN, buff=0.8)
            else:
                point_text.next_to(point_group[-1], DOWN, buff=0.3)
            point_group.add(point_text)
            
            self.play(Write(point_text))
            self.wait(0.8)
        
        self.wait(1)
        
        # Highlight importance of understanding rules
        highlight_text = Text("Highlight that understanding the rules and procedures", 
                            font_size=32, color=WHITE)
        highlight_text.next_to(point_group, DOWN, buff=1)
        
        rules_text = Text("of a test is crucial for applying it correctly.", 
                        font_size=32, color=WHITE)
        rules_text.next_to(highlight_text, DOWN, buff=0.3)
        
        self.play(Write(highlight_text))
        self.wait(0.5)
        self.play(Write(rules_text))
        self.wait(1)
        
        # Final message with emphasis
        final_message = Text("Tests make mathematics logical and precise!", 
                           font_size=42, color=YELLOW)
        final_message.next_to(rules_text, DOWN, buff=1.5)
        
        # Create a rectangle around the final message for emphasis
        final_rect = SurroundingRectangle(final_message, color=YELLOW, buff=0.3)
        
        self.play(Write(final_message))
        self.play(Create(final_rect))
        self.wait(2)
        
        # Fade out everything except the final message
        fade_group = VGroup(heading, summary_text, point_group, highlight_text, rules_text)
        self.play(FadeOut(fade_group))
        self.wait(1)
        
        # Make final message more prominent
        self.play(
            final_message.animate.scale(1.2),
            final_rect.animate.scale(1.2)
        )
        self.wait(3)